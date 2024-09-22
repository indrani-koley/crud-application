import React, {useState, useEffect} from 'react';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from "axios";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Crud = () => {
    const empdata = [
        {
            id: 1,
            name: 'Jishu',
            age: 24,
            isActive: 1
        },
        {
            id: 2,
            name: 'Shaan',
            age: 23,
            isActive: 1
        },
        {
            id: 3,
            name: 'Pritam',
            age: 21,
            isActive: 0
        },
        {
            id: 4,
            name: 'Sasank',
            age: 22,
            isActive: 0
        }
    ]
const [data, setData] = useState([]);

const [name, setName] = useState('');
const [age, setAge] = useState();
const [isActive, setIsActive] = useState(0);
const [editId, setEditId] = useState('')
const [editName, setEditName] = useState('');
const [editAge, setEditAge] = useState();
const [editIsActive, setEditIsActive] = useState(0);

const [show, setShow] = useState(false);
const handleClose = () => setShow(false);
const handleShow = () => setShow(true);

const handleEdit = (id) => {
    handleShow();
    axios.get(`http://localhost:5024/api/Employee/${id}`)
    .then((result)=>{
      setEditName(result.data.name);
      setEditAge(result.data.age);
      setEditIsActive(result.data.isActive)
      setEditId(id)
    })
    .catch((error)=>{
      console.log(error)
    })
}

useEffect(() => {
    // setData(empdata) // it sets the state 'data' with 'empdata'
    getData();
}, []);

const getData = () => {
  axios.get("http://localhost:5024/api/Employee")
  .then((result)=>{
    setData(result.data)
  })
  .catch((error)=>{
    console.log(error)
  })
};
const handleSubmit=()=>{
  const url="http://localhost:5024/api/Employee";
  const data = {
  "name": name,
  "age": age,
  "isActive": isActive
  }
  axios.post(url, data)
  .then((result)=>{
    getData();
    clear();
    toast.success("Employee has been submitted");
    console.log(result.data)
  })
  .catch((error)=>{
    toast.error(error);
  })

};
const clear = () =>{
  setName("");
  setAge("");
  setIsActive(0);
  setEditName("");
  setEditAge("");
  setEditIsActive(0);
  setEditId("")
}
const handleDelete = (id) => {
    if(window.confirm('Are you sure want to delete employee data?') === true){
       axios.delete(`http://localhost:5024/api/Employee/${id}`)
       .then((result)=>{
        if(result.status === 200){
          toast.success("Employee has been deleted succesfully")
          getData();
        }
       })
       .catch((error)=>{
          toast.error(error)
       })
    }
}
const handleUpdate = () =>{
  const url=`http://localhost:5024/api/Employee/${editId}`
  const data = {
  "id": editId,
  "name": editName,
  "age": editAge,
  "isActive": editIsActive  
}
axios.put(url, data)
.then((result)=>{
  getData();
  clear();
  toast.success("Employee has been updated");
  console.log(result.data)
  handleClose();
})
.catch((error)=>{
  toast.error(error);
})

};
const handleActive =(e)=>{
  if(e.target.checked){
    setIsActive(1)
  }
  else{
    setIsActive(0)
  }
}
const handleEditActive = (e)=>{
  if(e.target.checked){
    setEditIsActive(1)
  }
  else{
    setEditIsActive(0)
  }
}

    return (
       <>
       <ToastContainer />
        <Container style={{marginTop: '10px'}}>
      <Row>
        <Col>
        <input type='text' className='form-control' placeholder='Enter name' value={name} onChange={(e) => setName(e.target.value) }/>
        </Col>
        <Col>
        <input type='number' className='form-control' placeholder='Enter age' value={age} onChange={(e) => setAge(e.target.value) }/>
        </Col>
        <Col>
        <input type='checkbox' 
        checked={isActive === 1 ? true  : false} onChange={(e) => handleActive(e)} value={isActive} />
        <label style={{marginLeft:'10px'}}>IsActive</label>
        </Col>
        <Col>
        <button className='btn btn-primary' onClick={()=> handleSubmit()}>Submit</button>
        </Col>
      </Row>  
    </Container>
    <br></br>


        <Table striped bordered hover>
        <thead>
            <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>isActive</th>
            <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            { data && data.length > 0 ?
                data.map((item, index) => {
                    return (
                        <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.age}</td>
                        <td>{item.isActive}</td>
                        <td colSpan={2}>
                            <button className='btn btn-primary' onClick={()=> handleEdit(item.id)}>Edit</button> &nbsp;
                            <button className='btn btn-danger' onClick={()=> handleDelete(item.id)}>Delete</button>
                        </td>
                    </tr>
                    )
                })
                :
                'loading...'
            }
        
        </tbody>
        </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modify Emp Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Row>
        <Col>
        <input type='text' className='form-control' placeholder='Enter name' value={editName} onChange={(e) => setEditName(e.target.value) }/>
        </Col>
        <Col>
        <input type='text' className='form-control' placeholder='Enetr age' value={editAge} onChange={(e) => setEditAge(e.target.value) }/>
        </Col>
        <Col>
        <input type='checkbox' 
        checked={editIsActive === 1 ? true  : false} onChange={(e) => handleEditActive(e)} value={editIsActive} />
        <label style={{marginLeft:'10px'}}>IsActive</label>
        </Col>
      </Row></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
    )
}
export default Crud;

