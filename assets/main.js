const siteForm = document.querySelector(".form .sites_Form");
const site = document.querySelectorAll(".form .sites_Form .form-control");
let sites = JSON.parse(localStorage.getItem("sites")) || [];
const removeAllBtn = document.querySelector(".form .remove_all_btn");
const searchSite = document.querySelector(".search_site");
const errorMessage = Array.from(document.querySelectorAll(".error_message"));
const addBtn = document.querySelector(".add_btn");
let currentIndex = null;

searchSite.addEventListener("input",()=>{
    const filteredSites = sites.filter(site=>{
        return site.siteName.toLowerCase().includes(searchSite.value.toLowerCase());
    })
    const result = filteredSites.map((site,index)=>{
        return`
        <tr>
        <td>${index}</td>
        <td>${site.siteName}</td>
        <td>${site.siteURL}</td>
        <td>${site.userName}</td>
        <td>${site.userPass}</td>
        <td class = "ps-4">
        <button type="button" class="btn border-0 p-0" onclick="editSite(${index})"><i class="fa-solid fa-pen-to-square" style="color: #196d09;"></i></button>
        <button type="button" class="btn border-0 p-0" onclick="removeSite(${index})"><i class="fa-solid fa-trash" style="color: #8f1414;"></i></button>
        </td>
        </tr>
        `
    })
document.querySelector(".table_data").innerHTML = result.join(" ");
})

removeAllBtn.addEventListener("click", ()=>{

    const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success",
    cancelButton: "btn btn-danger"
  },
  buttonsStyling: false
});
swalWithBootstrapButtons.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Yes, delete it!",
  cancelButtonText: "No, cancel!",
  reverseButtons: true
}).then((result) => {
  if (result.isConfirmed) {
    sites =[];
    localStorage.removeItem("sites");
    displaySites();
    swalWithBootstrapButtons.fire({
      title: "Deleted!",
      text: "Your data has been deleted.",
      icon: "success"
    });
  } else if (
    /* Read more about handling dismissals below */
    result.dismiss === Swal.DismissReason.cancel
  ) {
    swalWithBootstrapButtons.fire({
      title: "Cancelled",
      text: "Your data is safe :)",
      icon: "error"
    });
  }
});

})

const validateSiteName = ()=>{
    const siteNameRegex = /^[A-Za-z0-9\s\-]{3,30}$/;
    if(siteNameRegex.test(site[0].value)){
        site[0].classList.add("is-valid");
        site[0].classList.remove("is-invalid");
        errorMessage[0].textContent="";
        return true;
    }
    else if(!siteNameRegex.test(site[0].value)){
        site[0].classList.remove("is-valid");
        site[0].classList.add("is-invalid");
        errorMessage[0].innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color: #b8a04c;"></i> Site name must be 3–30 characters (letters and numbers only).';
        return false;
    }
}
site[0].addEventListener("input", validateSiteName);

const validateSiteURL = ()=>{
    const SiteURLRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[\w\-./?%&=]*)?$/;
    if(SiteURLRegex.test(site[1].value)){
        site[1].classList.add("is-valid");
        site[1].classList.remove("is-invalid");
        errorMessage[1].textContent="";
        return true;
    }
    else if(!SiteURLRegex.test(site[1].value)){
        site[1].classList.remove("is-valid");
        site[1].classList.add("is-invalid");
        errorMessage[1].innerHTML ='<i class="fa-solid fa-triangle-exclamation" style="color: #b8a04c;"></i> Please enter a valid URL (e.g., https://example.com).';
        return false;
    }
}
site[1].addEventListener("input", validateSiteURL);

const validateUserEmail = ()=>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(emailRegex.test(site[2].value)){
        site[2].classList.add("is-valid");
        site[2].classList.remove("is-invalid");
        errorMessage[2].textContent="";
        return true;
    }
    else if(!emailRegex.test(site[2].value)){
        site[2].classList.remove("is-valid");
        site[2].classList.add("is-invalid");
        errorMessage[2].innerHTML='<i class="fa-solid fa-triangle-exclamation" style="color: #b8a04c;"></i> Please enter a valid email address.';
        return false;
    }
}
site[2].addEventListener("input", validateUserEmail);

const validateUserPassword = ()=>{
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(passwordRegex.test(site[3].value)){
        site[3].classList.add("is-valid");
        site[3].classList.remove("is-invalid");
        errorMessage[3].textContent="";
        return true;
    }
    else if(!passwordRegex.test(site[3].value)){
        site[3].classList.remove("is-valid");
        site[3].classList.add("is-invalid");
        errorMessage[3].innerHTML='<i class="fa-solid fa-triangle-exclamation" style="color: #b8a04c;"></i> Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and symbol.';
        return false;
    }
}
site[3].addEventListener("input", validateUserPassword);

siteForm.addEventListener("submit", e=>{
    e.preventDefault();
       
    let isValidSite = true;
    if(!validateSiteName() || !validateUserEmail() || !validateUserPassword() || !validateSiteURL())
        isValidSite=false;

    if(!isValidSite)
        return;

    const siteInfo = {
        siteName : site[0].value,
        siteURL : site[1].value,
        userName : site[2].value,
        userPass : site[3].value
    }
    if(currentIndex!=null){
        sites[currentIndex]= siteInfo;
        currentIndex = null;
        addBtn.textContent= "Add";
    }
    else{
        sites.push(siteInfo);
    }
    localStorage.setItem("sites", JSON.stringify(sites));
    siteForm.reset();
    displaySites();
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Your work has been saved",
      showConfirmButton: false,
      timer: 1500
    });
})

const displaySites = ()=>{
    const result = sites.map((site,index)=>{
        return`
        <tr>
        <td>${index}</td>
        <td>${site.siteName}</td>
        <td>${site.siteURL}</td>
        <td>${site.userName}</td>
        <td>${site.userPass}</td>
        <td class = "ps-4">
        <button type="button" class="btn border-0 p-0" onclick="editSite(${index})"><i class="fa-solid fa-pen-to-square" style="color: #196d09;"></i></button>
        <button type="button" class="btn border-0 p-0" onclick="removeSite(${index})"><i class="fa-solid fa-trash" style="color: #8f1414;"></i></button>
        </td>
        </tr>
        `
    })
document.querySelector(".table_data").innerHTML = result.join(" ");
}
displaySites();

const removeSite = (index)=>{
    sites.splice(index,1);
    localStorage.setItem("sites", JSON.stringify(sites));
    displaySites();
}


const unloadData = (index)=>{
    site[0].value = sites[index].siteName;
    site[1].value = sites[index].siteURL;
    site[2].value = sites[index].userName;
    site[3].value = sites[index].userPass;

    addBtn.textContent="Edit";
    currentIndex = index;
}

const editSite = (index)=>{
    unloadData(index);
}
