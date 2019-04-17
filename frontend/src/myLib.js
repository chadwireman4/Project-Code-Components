export function darkTheme(){
	//exectute when all DOM is loaded
	window.addEventListener('load', function() {
		var check = document.getElementById("check");
		var body = document.getElementById("body");
		console.log('All assets are loaded')
		var toggle = document.getElementById("switch");
		toggle.addEventListener('click', () => {
			console.log("clicked");
			if(check.checked === true){
				body.classList.add("dark");
			}
			if(check.checked === false){
				body.classList.remove("dark");
			}
		})
	})
}


