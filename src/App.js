import React, { Component } from 'react';
import './App.css';


class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { newTodo: "", editText: "", counter: 0, };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  handleChange(event) {
    this.setState({ newTodo: event.target.value });
  };
  handleKeyUp(event) {
    if (event.keyCode === 13) {
      const todo = {
        id: this.state.counter,
        msg: this.state.newTodo,
        isCompleted: false,
        isEdit: false,
      }
      this.props.addTodos(todo);
      this.setState((prevState) => ({
        newTodo: "",
        counter: prevState.counter + 1,
      }))
    }

  }
  render() {
    return (
      <header className="header">
        <h1>myTodos</h1>
        <input className="new-todo"
          type="text"
          autoFocus autoComplete="off"
          placeholder="What needs to be done?"
          value={this.state.newTodo}
          onChange={this.handleChange}
          onKeyUp={this.handleKeyUp} />
      </header>
    );
  }
}

class Todo extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(todo) {
    const obj = {
      id: todo.id,
      isCompleted: todo.isCompleted,
      isEdit: todo.isEdit,
    }
    this.props.toggleC(obj);
  }
  render() {
    return (
      <li className="todo">
        <div className="view">
          <input className="toggle" type="checkbox"
            onChange={this.handleClick(this.props.todo)} />
          <label>{this.props.todo.msg}</label>
          <button className="destroy" ></button>
        </div>
        <input className="edit" type="text" />
      </li>
    )
  }
}


function TodoList(props) {
  console.log(props.filterList);
  const listItems = props.filterList.map((todo) =>
    <Todo key={todo.id}
      todo={todo}
      toggleC={props.toggleC} />
  ).reverse();//从数组尾部开始渲染。
  return (
    <section className="main">
      <input className="toggle-all" type="checkbox" />
      <ul className="todo-list">
        {listItems}
      </ul>
    </section>
  )
}



class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = { remaining: "", };
  }
  render() {
    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>{this.state.remaining}</strong> {this.state.remaining > 1 ? 'items' : 'item'} left
        </span>
        <ul className="filters">
          <li><a href="#/all" >All</a></li>
          <li><a href="#/active">Active</a></li>
          <li><a href="#/completed">Completed</a></li>
        </ul>
        <button className="clear-completed">
          Clear completed
        </button>
      </footer>
    );
  }
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { todolist: [], filterList: [1, 2, 3], visibiliti: "all" }
    this.addTodos = this.addTodos.bind(this);
    this.toggleCompleted = this.toggleCompleted.bind(this)
  }

  toggleCompleted(obj) {
    const todos = this.state.todolist;
    const index = todos.findIndex((element) => {
      return element.id === obj.id;
    })
  //   if (index >= 0) {
  //     Object.assign(todos[index], obj);
  //     this.setState({
  //       todolist: todos,
  //     })
  // }
  }
  addTodos(todo) {
    if (todo) {
      const todos = this.state.todolist;
      todos.push(todo);
      this.setState({
        todoList: todos
      });
    }
  }

  render() {
    return (
      <section className="todoapp">
        <Header addTodos={this.addTodos} />
        <TodoList filterList={this.state.todolist}
          toggleC={this.toggleCompleted} />
        <Footer />
      </section>
    );
  }
}

export default App;
