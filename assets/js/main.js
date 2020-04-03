let baseUrl = 'http://localhost:3000'

$(document).ready(function () {
    auth()
    $('#logout').click(function () {
        localStorage.clear()
        auth()
    })

    $('#login-link').click(function (event) {
        event.preventDefault()
        $('#signup').hide()
        $('#login').show()
    })

    $('#add').click(function (event) {
        event.preventDefault()
        $('#destination-update').val('')
        $('#activity-update').val('')
        $('#status-update').val('')
        $('#date-update').val('')

        $('#travel-create').attr('style', 'display:  !important;');
        $('#view-data').attr('style', 'display:none  !important;');
    })

    $('#view').click(function (event) {
        event.preventDefault()
        $('#travel-create').attr('style', 'display:none  !important;');
        $('#view-data').attr('style', 'display:  !important;');
    })
})

function btn_signUp(event) {
    event.preventDefault()
    $('#signup').show()
    $('#login').hide()
}

function signout(event) {
    event.preventDefault()
    $('#bg').fadeIn("slow");
    $('#loading').attr('style', 'display:none !important');
    localStorage.clear()
    $('#bg').fadeOut("slow");
    auth()
}

function signIn(event) {
    event.preventDefault()
    $('#bg').fadeIn("slow");
    $('#loading').attr('style', 'display:table !important; display: flex !important;justify-content: center !important; align-items: center !important;');
    const email = $('#email-login').val()
    const password = $('#password-login').val()
    console.log(email, password)

    $.ajax({
        method: 'POST',
        url: baseUrl + '/user/signin',
        data: {
            email,
            password
        }
    })
        .done(data => {
            $('#loading').attr('style', 'display:none !important');
            $('#bg').fadeOut("slow");
            localStorage.setItem('token', data.access_token)
            auth()
        })
        .fail(err => {
            $('#loading').attr('style', 'display:none !important');
            $('#bg').fadeOut("slow");
            console.log(err);
        })
}

function signUp(event) {
    event.preventDefault()
    $('#bg').fadeIn("slow");
    $('#loading').attr('style', 'display:table !important; display: flex !important;justify-content: center !important; align-items: center !important;');
    const email = $('#email-signup').val()
    const password = $('#password-signup').val()

    $.ajax({
        method: 'POST',
        url: baseUrl + '/user/signup',
        data: {
            email,
            password
        }
    })
        .done(data => {
            $('#loading').attr('style', 'display:none !important');
            $('#bg').fadeOut("slow");
            localStorage.setItem('token', data.access_token)
            auth()
            console.log(data)
        })
        .fail(err => {
            $('#loading').attr('style', 'display:none !important');
            $('#bg').fadeOut("slow");
            console.log(err);
        })
}

// Travel

const hideShow = (target, hide, show) => {
    $(target).click(function (event) {
        event.preventDefault()
        $(hide).attr('style', 'display:none !important')
        $(show).show()
    })
}

function auth(event) {
    console.log(localStorage.token);
    if (localStorage.token) {
        $('#form-data').attr('style', 'display:none !important')
        $('#travel-request').attr('style', 'display:flex !important; ')
        fetchData()
    } else {
        $('#form-data').show()
        $('#travel-request').attr('style', 'display:none !important; ')
    }
}

function fetchData(params) {
    $.ajax({
        method: 'GET',
        url: baseUrl + '/travel',
        headers: {
            token: localStorage.token
        }
    })
        .done(data => {
            
            $('.view-data-all').empty()
            console.log(data)
            for (let i in data) {
                let id = data[i].id
                let travel_date = new Date(data[i].travel_date).toDateString()
                let destination = data[i].destination
                let createAt = new Date(data[i].createdAt).toDateString()
                let status = data[i].status
                let activity = data[i].activity
                let element = ''
                if (status) {
                    element = `<div class="" style="padding: 5px; font-size: 14px;"><p>Complete</p></div>`
                }
                else {
                    element = `<div class="" style="padding: 5px; font-size: 14px;"><p>Uncomplete</p></div>`
                }

                setTimeout(() => {
                    $('.view-data-all').append(
                        `
                        <div class="head-data d-flex justify-content-around mt-2" data-toggle="collapse" data-target="#collapse${id}" aria-expanded="false" style="cursor:pointer;padding: 35px!important;">
                            <input id="id" type="hidden" value="${id}">
                            <p style="color:#8f91aa !important;">${travel_date}</p>
                            <p style="color:#8f91aa !important;">${destination}</p>
                            <div>
                                <a href="" onclick="del(event)" style="color:#8f91aa !important;">Delete</a>
                                <a href="" data-toggle="modal" data-target="#create-travel" onclick="getid(event, ${id})" style="">Change</a>
                            </div>
                        </div>
                        
                        <div class="collapse" id="collapse${id}" >
                            <div class="my-card d-flex justify-content-between p-3">
                                <div class="left-data-view">
                                    <label style="color:#8f91aa !important;">Create At : ${createAt}</label>
                               </div>
                                <div class="my-card-2 pt-3 pl-5 pr-5 ">
                                    <div class="row">
                                        <div class="col-md-6"> 
                                            <div class="mb-3">
                                                    <label style="color:#8f91aa !important;">Activity : </label>
                                                    <p>${activity}</p>
                                            </div>
                                                <div class="mb-3">
                                                    <label style="color:#8f91aa !important;">Travel Date : </label>
                                                    <p>${travel_date}</p>
                                                </div>
                                                <div style="border:1.2px solid #f6f6fa"></div>
                                            <div class="mb-3">
                                                <label style="color:#8f91aa !important;">Status : </label>
                                                    ${element}
                                            </div>
                                        </div>
    
                                        <div id="cuaca${id}" class="col-md-6"> 
                                                
                                        </div>
                                          
                                    </div>
                                </div>
                            </div>
                        </div>`
                    )
                    cuaca(id, destination, '')
                }, 1000);

                
            }

        })
        .fail(err => {
            console.log(err);
        })
}

function add(event) {
    event.preventDefault()
    const destination = $('#destination-input').val()
    const activity = $('#activity-input').val()
    const status = $('#status-input').val()
    const travel_date = $('#date-input').val()
    console.log(destination, activity, status, travel_date)
    $.ajax({
        method: 'POST',
        url: baseUrl + '/travel',
        data: {
            destination,
            activity,
            status,
            travel_date
        },
        headers: {
            token: localStorage.token
        }
    })
        .done(data => {
            fetchData()
            $('#travel-create').attr('style', 'display:none  !important;');
            $('#view-data').attr('style', 'display:  !important;');
        })
        .fail(err => {
            console.log(err);
        })
}

function formatDate(formatDate) {
    let date = new Date(formatDate)
    let month = date.getMonth() + 1
    let day = date.getDate()
    if (month < 10) {
        month = '0' + month
    }
    if (day < 10) {
        day = '0' + day
    }

    return date.getFullYear() + "-" + month + "-" + day
}

function getid(event, id) {
    event.preventDefault()
    $.ajax({
        method: 'GET',
        url: baseUrl + `/travel/${id}`,
        headers: {
            token: localStorage.token
        }
    })
    .done(data => {
        console.log(data)
        event.preventDefault()
        const new_date = formatDate(data.travel_date)
        $('#id-update').val(data.id)
        $('#destination-update').val(data.destination)
        $('#activity-update').val(data.activity)
        $('#status-update').val(data.status)
        $('#date-update').val(new_date)
    })
    .fail(err =>{
        console.log(err)
    })

}

function update(event) {
    event.preventDefault()
    const id = $('#id-update').val()
    const destination = $('#destination-update').val()
    const activity = $('#activity-update').val()
    const status = $('#status-update').val()
    const travel_date = $('#date-update').val()

    $.ajax({
        method: 'PUT',
        url: baseUrl + '/travel/'+ id,
        headers: {
            token: localStorage.token
        },
        data: {
            destination,
            activity,
            status,
            travel_date
        }
    })
        .done(data => {
            auth()
            $('#create-travel, .modal-backdrop, .fade, .show').fadeOut("slow");
        })
        .fail(err =>{
            console.log(err);
            
        })

}

function del(event) {
    const id = $('#id').val()

    event.preventDefault()
    $.ajax({
        method: 'DELETE',
        url: baseUrl + `/travel/${id}`,
        headers: {
            token: localStorage.token
        }
    })
        .done(data => {
            auth()
            $('#view-data').attr('style', 'display:  !important;');
        })
        .fail(err => {
            console.log(err);
        })

}

// cuaca

function cuaca(id, city, event) {
    $.ajax({
        method: 'GET',
        url: baseUrl + '/api/' + city,
        headers: {
            token: localStorage.token
        }
    })
        .done(data=>{
            console.log();
            
            $('#cuaca'+id).append(
                `<div class="mb-3">
                    <label style="color:#8f91aa !important;">Time Zone : </label>
                    <p>${data.Weather.data[0].timezone}</p>
                </div>

                <div class="mb-3">
                    <label style="color:#8f91aa !important;">Counter Code : </label>
                    <p>${data.Weather.data[0].country_code}</p>
                </div>

                <div style="border:1.2px solid #f6f6fa"></div>

                <div class="mb-3">
                    <label style="color:#8f91aa !important;">Status : </label>
                    <img src="https://www.weatherbit.io/static/img/icons/${data.Weather.data[0].weather.icon}.png" style="width:32px;">
                    <p>${data.Weather.data[0].weather.description}, Temp : ${data.Weather.data[0].temp}</p>
                    <label style="color:#8f91aa !important;">City Name : </label>
                    <p>${data.Weather.data[0].city_name}</p>
                </div>`
            )
        })
        .fail(err =>{
            console.log(err)
        })
}

