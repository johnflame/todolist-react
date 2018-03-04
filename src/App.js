import React, { Component } from 'react';
import './App.css';
var classNames = require('classnames')

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { newTodo: "", counter: 0, };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  handleChange(event) {//当输入框内的值发生变化，同时更新newTodo
    this.setState({ newTodo: event.target.value });
  };
  handleKeyUp(event) { //当用户敲击enter，把输入的值生成一个对象，添加进todolist之中
    if (event.keyCode === 13 && this.state.newTodo.length > 0) {
      const todo = {
        id: this.state.counter,  //作为key，唯一
        msg: this.state.newTodo.trim(),
        isCompleted: false,   //完成状态
        isEdit: false,          //编辑状态
      }
      this.props.addTodo(todo);   //调用父级方法修改父级中的state
      this.setState((prevState) => ({  //清空是输入框，并将counter+1作为下一个key
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
          value={this.state.newTodo} //将value的值与newTodo绑定
          onChange={this.handleChange}
          onKeyUp={this.handleKeyUp} />
      </header>
    );
  }
}

class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = { editText: "", }
    this.handleCompleted = this.toggle.bind(this, this.props.todo, "c");//更改isCompleted状态
    this.handleEdit = this.toggle.bind(this, this.props.todo, "e");//更改isEdit状态
    this.remove = this.remove.bind(this, this.props.todo);       //移除todo
    this.editing = this.editing.bind(this, this.props.todo);      //显示编辑界面
    this.finishEdit = this.finishEdit.bind(this, this.props.todo);
    this.handleBlur = this.handleBlur.bind(this,this.props.todo);
    this.editChange = this.editChange.bind(this);
    this.editFocus = this.editFocus.bind(this);
  }
  componentDidUpdate(){
    this.editFocus();
  }
  toggle(todo, type) {  //改变单个todo的状态
    const obj = {
      id: todo.id,
      isCompleted: type === "c" ? !todo.isCompleted : todo.isCompleted,
      isEdit: type === "e" ? !todo.isEdit : todo.isEdit,
    }
    this.props.toggleOne(obj); //调用父级的父级传递的方法
  }
  remove(todo) {    //删除某个todo
    const obj = {
      id: todo.id  //根据id删除
    }
    this.props.rmTodo(obj);
  }
  editing(todo) {//编辑某个todo
    this.handleEdit();
    this.setState({ editText: todo.msg });
  }
  editFocus() {
    // 直接使用原生 API 使 text 输入框获得焦点
    this.editInput.focus();
  }
  editChange(event) {//当输入框内的值发生变化，同时更新editText
    this.setState({ editText: event.target.value });
  };

  finishEdit(todo, event) {
    if (event.keyCode === 13) {//按下enter时
      const obj = {
        id: todo.id,
        msg: this.state.editText.trim(),
        isEdit: false,
      }
      this.props.toggleOne(obj);
      this.setState({ editText: "" });
    }
    else if (event.keyCode === 27) {  //按下ESC时
      this.handleEdit();
      this.setState({ editText: "" });
    }
  }
  handleBlur(todo){  //失去焦点时，关闭编辑
    const obj = {
      id: todo.id,
      isEdit: false,
    }
    this.props.toggleOne(obj);
    this.setState({ editText: "" });
  }
  render() {
    return (
      <li className={classNames('todo',{editing:this.props.todo.isEdit,completed:this.props.todo.isCompleted})}>
        <div className="view">
          <input className="toggle" type="checkbox"
            checked={this.props.todo.isCompleted}
            onClick={this.handleCompleted} />
          <label onDoubleClick={this.editing}>{this.props.todo.msg}</label>
          <button className="destroy" onClick={this.remove}></button>
        </div>
        <input className="edit" type="text"
          value={this.state.editText}
          onKeyUp={this.finishEdit}
          onChange={this.editChange}
          onBlur={this.handleBlur}
          ref={(input) => { this.editInput = input; }} />
      </li>
    )
  }
}


function TodoList(props) {
  const listItems = props.filterList.map((todo) =>
    <Todo key={todo.id}
      todo={todo}
      toggleOne={props.toggleOne}
      rmTodo={props.rmTodo} />
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
    this.state = { todoList: [], filterList: [], visibiliti: "all" }
    this.addTodo = this.addTodo.bind(this);
    this.toggleOne = this.toggleOne.bind(this);
    this.rmTodo = this.rmTodo.bind(this);
    // this.toggleAll = this.toggleAll.bind(this)
  }
  // toggleAll(value){
  //   const todos = this.state.todoList.slice();
  //   todos.forEach(function(todo){
  //     todo.isCompleted =value
  //   })
  //   this.setState({
  //     todoList:todos
  //   })
  // }
  toggleOne(obj) {   //更改每一个Todo的状态，内容
    const todos = this.state.todoList.slice();
    const index = todos.findIndex((element) => {
      return element.id === obj.id;
    })
    if (index >= 0) {
      Object.assign(todos[index], obj);
      this.setState({
        todoList: todos
      });
    }
  }
  addTodo(todo) {
    if (todo) {
      const todos = this.state.todoList.slice();
      todos.push(todo);
      this.setState({
        todoList: todos
      });
    }
  }
  rmTodo(todo) {
    const todos = this.state.todoList.slice();
    const index = todos.findIndex((element) => {
      return element.id === todo.id;
    })
    todos.splice(index, 1);
    this.setState({
      todoList: todos
    });
  }
  render() {
    return (
      <section className="todoapp">
        <Header addTodo={this.addTodo} />
        <TodoList filterList={this.state.todoList}
          toggleOne={this.toggleOne}
          rmTodo={this.rmTodo}
          toggleAll={this.toggleAll} />
        <Footer />
      </section>
    );
  }
}

export default App;
