import context from "./context";
import { useState } from "react";

const State = (props) => {
  const host = "http://localhost:5000"

  const [Student, setStudent] = useState({});

  const [studs, setStuds] = useState([])

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);

  const [len, setlen] = useState(Math.ceil(studs.length / itemsPerPage));

  const [sortField, setSortField] = useState('sid');
  const [sortOrder, setSortOrder] = useState('asc');

  // Get all
  const getStuds = async () => {
    const response = await fetch(`${host}/studs/allstuds`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      }
    });
    const json = await response.json()
    setStuds(json)
  }

  // Add
  const addStud = async (sid, name, Fname, Mname, DOB, classn, mScience, mMaths, mSST, mEnglish, mHindi, mCoo) => {
    const response = await fetch(`${host}/studs/addstud`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ sid, name, Fname, Mname, DOB, classn, mScience, mMaths, mSST, mEnglish, mHindi, mCoo })
    });

    const stud = await response.json();
    setStuds(studs.concat(stud))
  }

  // FindById
  const findStudById = async (id) => {
    const newStud = studs.filter((stud) => stud.sid.includes(id))
    setStuds(newStud)
  }

  // FindByName
  const findStudByName = async (fname) => {
    const newStud = studs.filter((stud) => stud.name.toLowerCase().includes(fname.toLowerCase()))
    setStuds(newStud)
  }

  // Edit
  const editStud = async (id, name, Fname, Mname, DOB, classn, mScience, mMaths, mSST, mEnglish, mHindi, mCoo) => {
    const response = await fetch(`${host}/studs/updatestud/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ name, Fname, Mname, DOB, classn, mScience, mMaths, mSST, mEnglish, mHindi, mCoo })
    });
    const json = await response.json();
    console.log(json)
    let newStuds = JSON.parse(JSON.stringify(studs))
    // Logic to edit
    for (let index = 0; index < newStuds.length; index++) {
      const element = newStuds[index];
      if (element.sid === id) {
        newStuds[index].name = name;
        newStuds[index].Fname = Fname;
        newStuds[index].Mname = Mname;
        newStuds[index].DOB = DOB;
        newStuds[index].classn = classn;
        newStuds[index].mScience = mScience;
        newStuds[index].mMaths = mMaths;
        newStuds[index].mSST = mSST;
        newStuds[index].mEnglish = mEnglish;
        newStuds[index].mHindi = mHindi;
        newStuds[index].mCoo = mCoo;
        break;
      }
    }
    setStuds(newStuds);
  }

  // Delete
  const deleteStud = async (id) => {
    try {
      const response = await fetch(`${host}/studs/deletestud/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": localStorage.getItem('token')
        },
      });
      if (response.ok) {
        const json = await response.json();
        console.log(json);
        const newStud = studs.filter((stud) => stud.sid !== id);
        setStuds(newStud);
      } else {
        console.error('Failed to delete student:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };



  return (
    <context.Provider value={{ studs, addStud, deleteStud, editStud, getStuds, findStudById, findStudByName, currentPage, setCurrentPage, itemsPerPage, len, setlen, sortField, setSortField, sortOrder, setSortOrder, Student, setStudent }}>
      {props.children}
    </context.Provider>
  )
}
export default State;