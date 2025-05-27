import axios from "axios";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';

const Dtable = () => {
  let navigate = useNavigate();
  const [studnt, setStudnt] = useState([]);
  const [users, setUsers] = useState({
    studentId: "",
    name: "",
    department: "",
  });

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setUsers({ studentId: "", name: "", department: "" }); // Reset form on open
    setShow(true);
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios.get("http://92.205.109.210:8051/api/getall")
      .then((res) => setStudnt(res.data.data))
      .catch(err => console.error("Error fetching student data:", err));
  };

  const deleteFunction = (id) => {
    axios.post(`http://92.205.109.210:8051/api/delete/${id}`)
      .then(() => {
        alert("Deleted Successfully");
        setStudnt(prevData => prevData.filter(student => student.studentId !== id));
      })
      .catch(err => console.error("Error deleting student:", err));
  };

  const handleAddMarks = (studentId) => {
    navigate("/Nav", { state: { studentId } });
  };

  const changeHandler = (e) => {
    setUsers({ ...users, [e.target.name]: e.target.value });
  };

  const formSave = (e) => {
    e.preventDefault();
    axios.post("http://92.205.109.210:8051/api/create", users)
      .then(() => {
        alert("Created Successfully");
        getData();
        handleClose();
      })
      .catch(err => console.error("Error creating student:", err));
  };

  const columns = [
    { name: "Student ID", selector: (row) => row.studentId },
    { name: "Name", selector: (row) => row.name },
    { name: "Department", selector: (row) => row.department },
    { name: "Delete", selector: (row) => <Button variant="danger" onClick={() => deleteFunction(row.studentId)}>Delete</Button> },
    { name: "Add Marks", selector: (row) => <Button variant="primary" onClick={() => handleAddMarks(row.studentId)}>Add Marks</Button> },
  ];

  return (
    <div>
      <h1>STUDENT TABLE</h1>
      <Button variant="primary" onClick={handleShow}>Create Student</Button>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Create Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={formSave}>
            <input type="text" name="studentId" placeholder="Student ID" value={users.studentId} onChange={changeHandler} /><br />
            <input type="text" name="name" placeholder="Name" value={users.name} onChange={changeHandler} /><br />
            <input type="text" name="department" placeholder="Department" value={users.department} onChange={changeHandler} /><br />
            <Button type="submit">Submit</Button>
          </form>
        </Modal.Body>
      </Modal>

      <DataTable columns={columns} data={studnt} pagination highlightOnHover />
    </div>
  );
};

export default Dtable;