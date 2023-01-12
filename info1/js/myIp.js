const http = new HTTP();
const url = `${window.location.origin}/my-ip/info`;

const loading = get("#loading");

document.addEventListener("DOMContentLoaded", e => {
  e.preventDefault();
  loading.style.display = "block";
  http.get(url).then(data => {
    loading.style.display = "none";
    if (data.status == "success") {
      document.getElementById("myIpInfo").innerHTML = `<ul>
        <li>IP: ${data._id}</li>
        <li>Location: ${data.city}, ${data.region}, ${data.country}</li>
      </ul>`;
    } else {
      showError("Error processing your IP. Please try again later.");
      document.getElementById("myIpInfo").innerHTML = "";
    }
  });
});
