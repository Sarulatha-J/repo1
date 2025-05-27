import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import DataTable from "react-data-table-component";
import Modal from "react-bootstrap/Modal";

const Nav = () => {
  const location = useLocation();
  const { studentId } = location.state;

  const [marks, setMarks] = useState({
    subject1: "",
    subject2: "",
    subject3: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [markData, setMarkData] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setMarks({ subject1: "", subject2: "", subject3: "" }); // Reset form on open
    setIsEdit(false);
    setShow(true);
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios.get("http://92.205.109.210:8051/api/getallmark")
      .then(res => setMarkData(res.data.data))
      .catch(err => console.error("Error fetching all marks:", err));
  };

  const deleteFunction = (id) => {
    axios.post(`http://92.205.109.210:8051/api/removemark/${id}`)
      .then(() => {
        alert("Deleted Successfully");
        setMarkData(prevData => prevData.filter(mark => mark.studentId !== id));
      })
      .catch(err => console.error("Error deleting marks:", err));
  };

  const changeHandler = (e) => {
    setMarks({ ...marks, [e.target.name]: e.target.value });
  };

  const editStudent = (stud) => {
    setIsEdit(true);
    setMarks(stud);
    setShow(true);
  };

  const formSave = (e) => {
    e.preventDefault();
    const url = isEdit
      ? `http://92.205.109.210:8051/api/updatemark/${marks.studentId}`
      : "http://92.205.109.210:8051/api/addmark";

    axios.post(url, { studentId, ...marks })
      .then(() => {
        alert(isEdit ? "Updated successfully" : "Added successfully");
        getData();
        setShow(false);
      })
      .catch(err => console.error("Error saving marks:", err));
  };

  const columns = [
    { name: "Student ID", selector: (row) => row.studentId },
    { name: "Subject 1", selector: (row) => row.subject1 },
    { name: "Subject 2", selector: (row) => row.subject2 },
    { name: "Subject 3", selector: (row) => row.subject3 },
    { name: "Edit", selector: (row) => <Button onClick={() => editStudent(row)}>Edit</Button> },
    { name: "Delete", selector: (row) => <Button variant="danger" onClick={() => deleteFunction(row.studentId)}>Delete</Button> },
  ];

  return (
    <div>
      <h1>Update Marks for Student ID: {studentId}</h1>
      <Button variant="primary" onClick={handleShow}>Add Marks</Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit Marks" : "Add Marks"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={formSave}>
            <input type="text" name="studentId" value={studentId} disabled /><br />
            <input type="text" name="subject1" placeholder="Marks for Subject 1" onChange={changeHandler} value={marks.subject1} /><br />
            <input type="text" name="subject2" placeholder="Marks for Subject 2" onChange={changeHandler} value={marks.subject2} /><br />
            <input type="text" name="subject3" placeholder="Marks for Subject 3" onChange={changeHandler} value={marks.subject3} /><br />
            <button>{isEdit ? "Update" : "Save"}</button>
          </form>
        </Modal.Body>
      </Modal>

      <h2>All Student Marks</h2>
      <DataTable columns={columns} data={markData} pagination highlightOnHover />
    </div>
  );
};

export default Nav;