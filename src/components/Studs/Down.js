import React, { useContext, useRef, useState } from 'react'
import context from '../../context/context';
import { utils as XLSXUtils, writeFile as writeExcelFile, read as readExcelFile } from 'xlsx';
const moment = require('moment');

function Down(props) {
  const scontext = useContext(context);
  const { studs, addStud, currentPage, setCurrentPage, len, editStud } = scontext;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handlePrev = () => setCurrentPage(currentPage - 1);
  const handleNext = () => setCurrentPage(currentPage + 1);

  const fileInput = useRef(null);
  const reff = useRef(null)
  const reffClose = useRef(null)
  const [Sstud, setSstud] = useState({ id: "", sname: "", sFname: "", sMname: "", sDOB: "", sclassn: "", smScience: "", smMaths: "", smSST: "", smEnglish: "", smHindi: "", smCoo: "" })

  const add = () => {
    reff.current.click();
  }

  const handleClick = (e) => {
    e.preventDefault();
    addStud(Sstud.id, Sstud.sname, Sstud.sFname, Sstud.sMname, Sstud.sDOB, Sstud.sclassn, Sstud.smScience, Sstud.smMaths, Sstud.smSST, Sstud.smEnglish, Sstud.smHindi, Sstud.smCoo)
    reffClose.current.click();
    setSstud({ id: "", sname: "", sFname: "", sMname: "", sDOB: "", sclassn: "", smScience: "", smMaths: "", smSST: "", smEnglish: "", smHindi: "", smCoo: "" })
    props.showAlert("Added Successfully", "success")
  }

  const onChange = (e) => {
    setSstud({ ...Sstud, [e.target.name]: e.target.value });
  };

  const exportToExcel = () => {
    // Create a new workbook
    const workbook = XLSXUtils.book_new();

    // Exclude the unwanted columns from the data
    const exportData = studs.map(({ sid, name, Fname, Mname, DOB, classn, mScience, mMaths, mSST, mEnglish, mHindi, mCoo }) => ({
      sid, name, Fname, Mname, DOB, classn, mScience, mMaths, mSST, mEnglish, mHindi, mCoo
    }));

    // Convert employee data to a worksheet
    const worksheet = XLSXUtils.json_to_sheet(exportData);

    // Add the worksheet to the workbook
    XLSXUtils.book_append_sheet(workbook, worksheet, 'StudentList');

    // Generate an Excel file and download it
    writeExcelFile(workbook, 'StudentList.xlsx');
  };

  const importFromExcel = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryString = event.target.result;
      const workbook = readExcelFile(binaryString, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSXUtils.sheet_to_json(worksheet, { header: 'A', blankrows: false });

      for (let i = 1; i < data.length; i++) {
        const student = data[i];
        const existingStudent = studs.find((s) => s.sid === student.A);
        if (existingStudent) {
          editStud(student.A, student.B, student.C, student.D, student.E, student.F, student.G, student.H, student.I, student.J, student.K, student.L);
        } else {
          addStud(student.A, student.B, student.C, student.D, student.E, student.F, student.G, student.H, student.I, student.J, student.K, student.L);
        }
      }

      console.log(data);

      reffClose.current.click();
      props.showAlert("Data imported successfully, Refreshing...", "success");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <nav aria-label="Page navigation example" >
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <a className="page-link" href="#" onClick={handlePrev}>
                &laquo;
              </a>
            </li>
            {Array.from({ length: len }, (_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <a className="page-link" href="#" onClick={() => paginate(i + 1)}>
                  {i + 1}
                </a>
              </li>
            ))}
            <li className={`page-item ${currentPage === len ? 'disabled' : ''}`}>
              <a className="page-link" href="#" onClick={handleNext}>
                &raquo;
              </a>
            </li>
          </ul>
        </nav>


        <button ref={reff} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal2">
          Launch demo modal
        </button>
        <div className="modal fade" id="exampleModal2" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Add Student</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"><i className="fa-solid fa-x"></i></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col">
                    <label htmlFor="eid" className="form-label">Sid</label>
                    <input type="text" className="form-control" id="id" name="id" value={Sstud.id} placeholder="Enter the student ID" aria-describedby="emailHelp" onChange={onChange} minLength={3} required />
                  </div>
                  <div className="col">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="sname" name="sname" value={Sstud.sname} placeholder="Name??" onChange={onChange} minLength={3} required />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <label htmlFor="Fname" className="form-label">Father's Name</label>
                    <input type="text" className="form-control" id="sFname" name="sFname" value={Sstud.sFname} onChange={onChange} minLength={3} required />
                  </div>
                  <div className="col">
                    <label htmlFor="Fname" className="form-label">Mother's Name</label>
                    <input type="text" className="form-control" id="sMname" name="sMname" value={Sstud.sMname} onChange={onChange} minLength={3} required />
                  </div>
                </div>
                <div className="row ">
                  <div className="col">
                    <label htmlFor="DOB" className="form-label">D.O.B</label>
                    <input type="date" className="form-control" id="sDOB" name="sDOB" value={moment(Sstud.sDOB).format('YYYY-MM-DD')} onChange={onChange} />
                  </div>
                  <div className="col">
                    <label htmlFor="classn" className="form-label">Class</label>
                    <input type="text" className="form-control" id="sclassn" name="sclassn" value={Sstud.sclassn} onChange={onChange} />
                  </div>
                </div> <br />
                <h4>Marks</h4>
                <div className="row ">
                  <div className="col">
                    <label htmlFor="mScience" className="form-label">Science</label>
                    <input type="number" min="0" max="100" className="form-control" id="smScience" name="smScience" placeholder="Out of 100" value={Sstud.smScience} onChange={onChange} />
                  </div>
                  <div className="col">
                    <label htmlFor="mMaths" className="form-label">Maths</label>
                    <input type="number" min="0" max="100" className="form-control" id="smMaths" name="smMaths" placeholder="Out of 100" value={Sstud.smMaths} onChange={onChange} />
                  </div>
                </div>
                <div className="row ">
                  <div className="col">
                    <label htmlFor="mEnglish" className="form-label">English</label>
                    <input type="number" min="0" max="100" className="form-control" id="smEnglish" name="smEnglish" placeholder="Out of 100" value={Sstud.smEnglish} onChange={onChange} />
                  </div>
                  <div className="col">
                    <label htmlFor="mHindi" className="form-label">Hindi</label>
                    <input type="number" min="0" max="100" className="form-control" id="smHindi" name="smHindi" placeholder="Out of 100" value={Sstud.smHindi} onChange={onChange} />
                  </div>
                </div>
                <div className="row ">
                  <div className="col">
                    <label htmlFor="mSST" className="form-label">Social Studies</label>
                    <input type="number" min="0" max="100" className="form-control" id="smSST" name="smSST" placeholder="Out of 100" value={Sstud.smSST} onChange={onChange} />
                  </div>
                  <div className="col">
                    <label htmlFor="mCoo" className="form-label">Extracurricular Activity</label>
                    <input type="number" min="0" max="100" className="form-control" id="smCoo" name="smCoo" placeholder="Out of 100" value={Sstud.smCoo} onChange={onChange} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button ref={reffClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button disabled={Sstud.sname.length < 3} onClick={handleClick} type="button" className="btn btn-primary">Add</button>
              </div>
            </div >
          </div >
        </div >


        <div>
          <input ref={fileInput} type="file" className="form-control-file" accept=".xlsx,.xls" id="exampleInputFile" aria-describedby="fileHelp" style={{ display: 'none' }} onChange={importFromExcel} />

          <button className="btn btn-secondary btn-lg mx-2 " onClick={exportToExcel} title="Export to Excel"><i class='fas fa-file-export' style={{ fontSize: "25px" }}></i></button>
          <button type="button" className="btn btn-primary btn-lg" onClick={() => { add() }} style={{ "alignItems": "center" }}>Add Student</button>
          <button className="btn btn-secondary btn-lg mx-2 " htmlFor="exampleInputFile" onClick={() => fileInput.current.click()} title="Import from Excel"><i class='fas fa-file-import' style={{ fontSize: "25px", transform: 'scaleX(-1)' }}></i></button>
        </div>
      </div>
    </>
  )
}

export default Down
