const fetchData = (states,max) => {
  const apiKey = 'KFnvfjmVMFmld7ypGDHt3RgscYjQrIlaro3G9QEU';
  let url = `https://developer.nps.gov/api/v1/parks?stateCode=${states.join(',')}&limit=${max}&api_key=${apiKey}`;
  let parksContainer = document.getElementById('parks');

  parksContainer.innerHTML = "";
    
  fetch(url)
    .then(response => {
      if(response.ok) return response.json();
      throw new Error(response.statusText)
    })
    .then(response => {

      response.data.forEach( park => {
        let button = 'No Address Available';
        let parkID = park.id.split('-').join("");

        if(park.latLong){
          let latLongArray = park.latLong.split(',');
          let lat  = latLongArray[0].split(':')[1];
          let long = latLongArray[1].split(':')[1];
          button   = `<button onclick="getAddress(${lat},${long},park${parkID})" class="show-address" type="button">Show Address</button>`
        }

        parksContainer.insertAdjacentHTML('beforeend', 
        `<div class="park">
           <h3>${park.fullName}</h3>
           <p>${park.description}</p>
           <a href="${park.url}" target=""_blank>Visit Website</a>
           <address id="park${parkID}"></address>
           ${button}
         </div>`);
      });
    })
    .catch(err => {
      document.querySelector('#error').innerText = `Something went wrong: ${err.message}`;
    });
}

const getAddress = (lat,long,element) => {
  let url = `https://us1.locationiq.com/v1/reverse.php?key=ddc20e17d5229e&lat=${lat}&lon=${long}&format=json`;
  
  fetch(url)
    .then(response => {
      if (response.ok) return response.json();
      throw new Error(response.statusText)
    })
    .then(data => {
      document.querySelector(`#${element.id}`).insertAdjacentHTML('beforeend',
      `
      <p>${data.address.road}</p>
      <p>${data.address.city}, ${data.address.state} ${data.address.postcode}</p>
      <p>${data.address.country}</p>
      `
      )
    })
}

const init = () => {
  const btn = document.getElementById('submit');
  
  btn.addEventListener('click', event => {
    event.preventDefault();
    const limit    = document.getElementById('max').value - 1;
    const selected = document.querySelectorAll('#state-select option:checked');
    const values   = Array.from(selected).map(el => el.value);
    if (values) fetchData(values,limit)
  });
}

(init())