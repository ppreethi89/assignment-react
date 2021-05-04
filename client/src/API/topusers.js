const topusers = async(date,month,year,filename) => {

 
    
    return await fetch("http://localhost:3001/inputAPI/topusernames", {
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

      }).then(resp => {
          return resp.json()
        }
          )
          .catch((error) =>{
            console.log("error")
            console.error(error);
            return error;
          });
    
       

    
}

export default topusers;