const topfiles = async(date,month,year,filename) => {

    
    
    return await fetch("http://localhost:3001/inputAPI/topfilenames", {
          method: 'POST',
           
          body:JSON.stringify({
            date:date,
        month: month,
        year:year,
        filename:filename
        }
        ),
        headers: {
          'Accept':'application/json',
          'Content-Type':'application/json'
      }

    }).then(resp => resp.json()).then(data => {
        return data;
    });
     

    
}

export default topfiles;