
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const form = new FormData();
    form.append("username", `${username}`);
    form.append("password", `${password}`);
    
    $.ajax({
        async: true,
        crossDomain: true,
        url: "https://api-events.sstream.co.ke/%20/api/v1/custom_auth/login",
        method: "POST",
        headers: {},
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data",
        data: form,
        success: function (response) {
                    const responseJson = JSON.parse(response);
                    if (responseJson.token != null) {
                        localStorage.setItem("jwt", responseJson.token);
                        window.location.href = './login.html';
                    } else {
                        Swal.fire({
                            text: "Invalid login credentials!",
                            icon: 'error',
                            confirmButtonText: 'OK'
                            });  
                    }                              
                },
        error:  function () {
            Swal.fire({
                text: "Error Logging in",
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }); 
    return false;
}

function register() {
    const username = document.getElementById("username").value;
    const email =  document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const jsonData = {email:`${email}`, password:`${password}`, username:`${username}`}
    
    $.ajax({
      async: true,
      crossDomain: true,
      url: "https://api-events.sstream.co.ke/api/v1/custom_auth/register",
      method: "POST",
      headers: {
          "cookie": "pretix_session=ass4pyekiea1xily0iwfp7q2k5m7cosm",
          "Content-Type": "application/json"
      },
      processData: false,
      data: JSON. stringify(jsonData),   
      success: function(response) {              
                    Swal.fire({
                        text: `Registered successfully as ${response.username}`,
                        icon: 'success',
                        confirmButtonText: 'OK'
                        }).then(() => {
                            window.location.href = './login.html';
                    });                    
                },
      error: function () {
            Swal.fire({
                text: "Error registering user!",
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });
    return false;
}

function getEvents() {
    let data = [];
    if (localStorage.getItem('jwt') === null) {
        window.location.href = './login.html';
    }

    $.ajax({
        async: true,
        crossDomain: true,
        url: "https://api-events.sstream.co.ke/api/v1/organizers/sstream/events/",
        method: "GET",
        headers: {
            "cookie": "pretix_session=ass4pyekiea1xily0iwfp7q2k5m7cosm",
            "Authorization": `Token ${localStorage.getItem('jwt')}`
        },
        success: function(response) {
            data = response.results.filter(d => 'logo_image' in d.meta_data);
            const myTable = document.getElementById("tableItems");
            let index = 1;
            data.map((myEvent) => {
                const row = myTable.insertRow(index);
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);
                const cell4 = row.insertCell(3);
                cell1.innerHTML = `${myEvent.name.en}`;
                cell2.innerHTML = `<img src="${myEvent.meta_data.logo_image}"/>`;
                cell3.innerHTML = `${GetDate(myEvent.date_from)}`;
                cell4.innerHTML = `${GetDate(myEvent.date_from)}`;
                index += 1;
            });  
        },
        error: function() {
            Swal.fire({
                text: `Invalid Authorization token`,
                icon: 'error',
                confirmButtonText: 'OK'
                }).then(() => {
                    localStorage.removeItem('jwt');
                    window.location.href = './login.html';
            });
        }
    });

    const GetDate = (d) => {
        const dd = new Date(d);
        return (dd.toLocaleString());
        }
    
}

function logout() {
    localStorage.removeItem("jwt");
    
    Swal.fire({
        text: `You have been logged out`,
        icon: 'success',
        confirmButtonText: 'OK'
        }).then(() => {
            window.location.href = './login.html'
    });
}