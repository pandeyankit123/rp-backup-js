import React, { useContext, useEffect } from 'react'
import context from '../../context/context';
import Studlist from './Studlist';
import Up from './Up';
import Down from './Down';

function Studs(props) {
  const scontext = useContext(context)
  const {getStuds, currentPage, itemsPerPage } = scontext;
  useEffect(() => {
      getStuds();
  }, [currentPage, itemsPerPage])
  return (
      <div className="container">
          <br />
          <Up showAlert={props.showAlert} />
          <br />
          <Studlist showAlert={props.showAlert} />
          <br />
          <Down showAlert={props.showAlert} />
          <hr />
      </div>
  )
}

export default Studs
