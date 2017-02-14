import $ from 'jquery';
import { githubApiKey } from '../../secrets.js';

var forEach = function(arr, func){
    for(var i = 0 ; i < arr.length; i++){
        func(arr[i], i, arr)
    }
}

var injectContent = document.querySelector('.main');
var input = document.querySelector('.first-input input');
var currentRoute = window.location.hash.slice(1);

var contentBuild = function(profInfo, repoInfo){
  var profileStr = `<div class="profile-left">`;
  var repoStr = `<div class="repo-right">`

  profileStr += `<img src="${profInfo.avatar_url}"/>
                 <h2>${profInfo.name}</h2>
                 <h3>${profInfo.login}</h3>
                 <button class="unfollow">Unfollow</button>
                 <p class="grey">Block or report user<p>
                 <hr/>
                 <p>${profInfo.blog}</p>
                 <p><i class="fa fa-map-marker" aria-hidden="true"></i>${profInfo.location}</p>
                 <p><i class="fa fa-envelope-o" aria-hidden="true"></i><a href="">${profInfo.email}</a></p>
                 <p><i class="fa fa-gg" aria-hidden="true"></i><a href="">${profInfo.html_url}</a></p>
                 </div>`;

              repoInfo.map(function(listEl){
              repoStr += `<h2><a href="">${listEl.name}</a></h2>
                          <p>${listEl.description}</p>
                          <span>${listEl.language}</span>
                          <span>${listEl.stargazers_count}</span>
                          <span>${listEl.updated_at}</span>
                          <hr/>`});

  return profileStr + repoStr;
}

var controllerRouter = function(){

    if(currentRoute === ''){
      var profilePromise = $.getJSON('https://api.github.com/users/hhveach');
      var reposPromise = $.getJSON('https://api.github.com/users/hhveach/repos');
      $.when(profilePromise, reposPromise).then(function(profileData, repoData){
        injectContent.innerHTML = contentBuild(profileData[0], repoData[0]);
      })
      return;
    }

      var profilePromise = $.getJSON('https://api.github.com/users/' + `${currentRoute}`);
      var reposPromise = $.getJSON('https://api.github.com/users/' + `${currentRoute}` + '/repos');
      $.when(profilePromise, reposPromise).then(function(profileData, repoData){
        injectContent.innerHTML = contentBuild(profileData[0], repoData[0]);
      })
      return;

}

input.addEventListener('keypress', function(evt){
  if(evt.keyCode === 13){
    currentRoute = input.value;
    input.value = '';
  }
})

input.addEventListener('keypress', controllerRouter)
controllerRouter();
window.addEventListener('hashchange', controllerRouter);
