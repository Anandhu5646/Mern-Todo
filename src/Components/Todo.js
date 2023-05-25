import React from 'react'
import './Todo.css'
import { useState, useRef, useEffect } from 'react'
import { TiDelete } from "react-icons/ti";
import { IoMdDoneAll } from "react-icons/io";
import { TbReload } from "react-icons/tb";
import { AiOutlineEdit } from "react-icons/ai";

function Todo() {

  const [state, setState] = useState('')
  const [datas, setData] = useState(() => {
    const storedData = localStorage.getItem('todos')
    return storedData ? JSON.parse(storedData) : []
  })
  const [editId, setEditId] = useState(0)

   // Load todos from localStorage on component mount
   useEffect(() => {
    const storedTodos = localStorage.getItem('todos')
    if (storedTodos) {
      setData(JSON.parse(storedTodos))
    }
  }, [])

  // Save todos to localStorage whenever the todos state changes
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(datas))
  }, [datas])


  const addTodo = () => {
    // to avoid empty todo
    if (state.trim() === '') {
      alert('Please enter a valid todo')
      return
    }
    // to avoid duplicate todo
    const dataStrings = datas.map((data) => data.list.toLowerCase().trim())
    if (dataStrings.includes(state.toLowerCase().trim())) {
      alert('This todo already exists')
      return
    }
    
    setData([...datas, { list: state, id: Date.now(), status: false }])
    console.log(datas)
    setState('')
    
    if (editId) {
      const editData = datas.find((todo) => todo.id === editId)
      const updateData = datas.map((to) => to.id === editData.id ?
      (to = { id: to.id, list: state }) : (to = { id: to.id, list: to.list }))
      
      setData(updateData)
      setEditId(0)
      setState('')
    }
    
    
  }

  const formControl = (e) => {
    e.preventDefault()
  }

  const inputRef = useRef('null')
  useEffect(()=>{
    inputRef.current.focus();
  })

  const onDelete = (id) => {
    setData(datas.filter((obj) => obj.id !== id))
  }
  const onComplete = (id) => {
    let complete = datas.map((list) => {
      if (list.id === id) {
        return ({ ...list, status: !list.status })
      }
      return list
    })
    setData(complete)
  }

  const onEdit = (id) => {
   
    const editData = datas.find((item) => item.id === id)
    setState(editData.list)
    setEditId(editData.id)

  }

  return (
    <div className='container'>
      <h3 >What is your plan for today?</h3>
      <form className='form-group' onSubmit={formControl}>
        <input ref={inputRef} value={state} onChange={(event) =>
          setState(event.target.value)} className='form-control' type="text" placeholder='Enter your todo' />
        <button onClick={addTodo}>{editId ? 'EDIT' : 'ADD'} </button>
      </form>
      
      <div className='list'>
        <ul>
          {
            datas.map((todo, index) => (
              <li className='form-control' key={index}>
                <div className='list-item-list' id={todo.status ? 'list-item' : ''}>{todo.list}</div>
                <span>{todo.status ?
                  (<TbReload className='list-icons' id='completed' title='Completed' />)
                  : (<IoMdDoneAll className='list-icons' id='complete' title='Complete' onClick={() => onComplete(todo.id)} />)}
                  {todo.status ? (
                  <AiOutlineEdit className='list-icons' id='edit-not' title='Edit'  />)
                : (<AiOutlineEdit className='list-icons' id='edit' title='Edit' onClick={() => onEdit(todo.id)} />)}
                  <TiDelete className='list-icons' id='delete' title='Delete' onClick={() => onDelete(todo.id)} />
                </span>
                  
              </li>

            ))

          }

        </ul>
      </div>
    </div>
  )
}

export default Todo
