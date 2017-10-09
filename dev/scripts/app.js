import React from 'react';
import ReactDOM from 'react-dom';
import firebase, { auth, provider } from './firebase.js';
import TypeWriter from 'react-typewriter';

class App extends React.Component {
	constructor(){
		super();
		this.state ={
			currentItem: '',
			link: '',
			userName: '',
			items: [],
			user: null
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
	}

	handleChange(e){
		this.setState({
			[e.target.name]: e.target.value,
		});
	}
	logout(){
		auth.signOut()
			.then(()=> {
				this.setState({
					user: null
				})
			})
	}

	login(){
		auth.signInWithPopup(provider)
		.then((result) => {
			const user = result.user;
			this.setState({
				user
			});
		});
	}


	handleSubmit(e){
		e.preventDefault();
		// preventing default on submit to avoid page refresh
		const itemsRef = firebase.database().ref('items');
		const item ={
			title: this.state.currentItem,
			user: this.state.user.displayName || this.state.user.email,
			link: this.state.link
		}
		itemsRef.push(item);
		// setting the state to be empty clears out the input so we can add a new item"
		this.setState({
			currentItem: '',
			userName: '',
			link: ''
		});
	}

	removeItem(itemId){
		const itemRef= firebase.database().ref(`/items/${itemId}`);
		itemRef.remove();
	}

	componentDidMount(){
		auth.onAuthStateChanged((user) => {
			if (user) {
				this.setState({ user });
			}
		});
		const itemsRef = firebase.database().ref('items');
		itemsRef.on('value', (snapshot) => {
			let items = snapshot.val();
			let newState = [];
			for (let item in items){
				newState.push({
					id: item,
					title: items[item].title,
					user: items[item].user,
					link:items[item].link
				});
			}
			this.setState({
				items: newState
			})
		})
	}

    render() {
      return (
        <div className ='app'>
          
       		 <header>
	       		 <div className="wrapper">
		       		 <div className="header__container">	
		       		 	<TypeWriter typing={1} fixed={true}>
		       		 		<h1 className="site__title-main">Hot Tips!</h1>
		       		 	</TypeWriter>
		       		 	<h2 className="site__title-sub">The app where budding developers can share usesul tools and links with eachother.</h2>
	       		 		{this.state.user ?
	       		 		<button onClick={this.logout}>Log Out</button>
	       		 		:
	       		 		<button onClick={this.login}>Log In</button>
	       		 		}
		       		 </div>
	       		 </div>
       		 </header>
       		{this.state.user ? 
       			<div>
       				<div className ='user-profile'>
       					<img src={this.state.user.photoURL} />
       				</div>
       				<div className='container'>
       					<section className='add-item'>
       						<form onSubmit={this.handleSubmit}>
       							<input type='text' name='userName' placeholder='your name' value={this.state.user.displayName || this.state.user.email} />
       							<input type='text' name='currentItem' placeholder="describe your resource" onChange={this.handleChange} value={this.state.currentItem} />
       							<input type='text' name='link' placeholder='paste link here' onChange={this.handleChange} value={this.state.link} />
       							<button>Add Resource</button>
       						</form>
       					</section>  

       					<section className='display-item'>
       						<div className='wrapper'>
       							<ul>
       								{this.state.items.map((item) =>{
       									return (
       										<li key={item.id}>
       											<h3>{item.title}</h3>

       											<p>
       												<a href={item.link} target="_blank"><button>Link</button></a>
       											</p>
       											<p>brought by: {item.user}
       												{item.user === this.state.user.displayName || item.user === this.state.user.email ?
       													<button onClick={() => this.removeItem(item.id)}>Remove Item</button>
       														: null}
       											</p>
       										</li>				
       										)
       								})}
       							</ul>	
       						</div>
       					</section>
       				</div>
       			</div>	
       			:
       	
       			<p className="warning">you must be logged in</p>
       				
       		}

        </div>
      );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
