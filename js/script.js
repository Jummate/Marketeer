
(function()
{
	let fName = $("#first-name");
	let lName = $("#last-name");
	let errorFirstName = $("#error-first-name");
	let errorLastName = $("#error-last-name");
	let passwordSignUp = $("#password-sign-up");
	let errorPasswordSignUp = $("#error-password-sign-up");
	let emailSignUp = $("#email-sign-up");
	let errorEmailSignUp = $("#error-email-sign-up");
	let textToBeEffected = $("#moving").text();
	let count = 0;
	const store = {};
	const selectedItems = {};
	let totalPrice;
	let pressedToggle = true;
	let password = "";
	let reveal = true;
	let loggedIn = false;
	let currentUserFirstName;
	let currentUserLastName;
	
	 // ---------------------------------------PayStack Integration -------------------------------------
	function payWithPaystack(userEmail, totalAmount, mobile) {

		const handler = PaystackPop.setup({ 
			key: 'pk_test_7ed1cc08c93f1363cf053ea89fd29e31614a9dda', //put your public key here
			email: userEmail, //put your customer's email here
			amount: totalAmount * 100, //amount the customer is supposed to pay
			metadata: {
				custom_fields: [
					{
						display_name: "Mobile Number",
						variable_name: "mobile_number",
						value: mobile //customer's mobile number
					}
				]
			},
			callback: function (response) {
				//after the transaction have been completed
				//make post call  to the server with to verify payment 
				//using transaction reference as post data
				$.post("verify.php", {reference:response.reference}, function(status){
					if(status == "success")
						//successful transaction
						alert('Transaction was successful');
					else
						//transaction failed
						alert(response);
				});
			},
			onClose: function () {
				//when the user close the payment modal
				alert('Transaction cancelled');
			}
		});
		handler.openIframe(); //open the paystack's payment modal
	}
	// -------------------------------------------------------------------------------------------------
	
	//--------------------------------------------------User Input Validation--------------------------------------------------
	
	function validateRating()
	{
		let rating = $("#rating").val();
		//let isValid = true;
		if(rating == "")
		{
			$("#rating").css("border", "2px solid red");
			$(".comment-alert").show();
			$(".comment-alert span").text("This field is required");
			return false;
		}
		if(!/^[0-9]+$/.test(rating))
		{
			$("#rating").css("border", "2px solid red");
			$(".comment-alert").show();
			$(".comment-alert span").text("Only digits are allowed");
			return false;
		}
		if(Number(rating) < 1 || Number(rating) > 5)
		{
			$("#rating").css("border", "2px solid red");
			$(".comment-alert").show();
			$(".comment-alert span").text("You can only rate from 1-5");
			return false;
		}
		$("#rating").css("border", "1px solid black");
		$(".comment-alert").hide();
		return true;
	}
	function validateEmpty(entry)
	{
		if(entry.val() == "")
		{
			$(entry).css("border", "2px solid red");
			$(".comment-alert").show();
			$(".comment-alert span").text("This field is required");
			return false;
		}
		$(entry).css("border", "1px solid black");
		$(".comment-alert").hide();
		return true;
	}
	function validateName(entry, error)
	{
		if(entry.val() == "")
		{
			$(entry).css("border", "2px solid red");
			$(error).show().text("This field is required");;
			return false;
		}
		if(!/^[A-Z]+$/i.test(entry.val()))
		{
			$(entry).css("border", "2px solid red");
			$(error).show().text("**Enter alphabets only.**");
			return false;
		}
		$(entry).css("border", "1px solid #dcdcdc");
		$(error).hide();
		return true;
		
		
	}
	
	function validateMobile()
	{
		let mobile = $("#mobile-no");
		if(mobile.val() == "")
		{
			$(mobile).css("border", "2px solid red");
			$("#error-mobile-no").show().text("This field is required");;
			return false;
		}
		if(!/^[0-9]+$/.test(mobile.val()))
		{
			$(mobile).css("border", "2px solid red");
			$("#error-mobile-no").show().text("**Only digits are allowed**");
			return false;
			
		}
		if(mobile.val().length != 11)
		{
			$(mobile).css("border", "2px solid red");
			$("#error-mobile-no").show().text("**The digits must be eleven**");
			return false;
		}
		$(mobile).css("border", "1px solid #dcdcdc");
		$("#error-mobile-no").hide();
		return true;
		
	}
	
	function validatePassword(entry, error)
	{
		let password = $(entry).val();
		if(password == "")
		{
			$(entry).css("border", "2px solid red");
			$(error).show().text("This field is required");;
			return false;
		}
		if(!(((/[A-Z]+/).test(password) && (/[0-9]+/).test(password)) && password.length > 7))
		{
			$(entry).css("border", "2px solid red");
			$(error).show().text("*Use 8 or more characters including uppercase and digits*");
			return false;
			
		}
		$(entry).css("border", "1px solid #dcdcdc");
		$(error).hide();
		return true;
		
	}
	
	function validateEmail(entry,error)
	{
		let pattern = /^[\w\.-_\+]+@[\w-]+(\.\w{2,4})+$/;
		if(entry.val() == "")
		{
			$(entry).css("border", "2px solid red");
			$(error).show().text("This field is required");;
			return false;
		}
		if(!pattern.test(entry.val()))
		{
			$(error).show().text("**Invalid entry. Check the email address**");
			return false;
			
		}
		$(entry).css("border", "1px solid #dcdcdc");
		$(error).hide();
		return true;
		
	}
	function confirmPassword()
	{
		if($("#password-sign-up").val() == $("#confirm-password").val())
		{
			$("#password-sign-up").css("border", "1px solid #dcdcdc");
			$("#confirm-password").css("border", "1px solid #dcdcdc");
			$("#error-confirm-password").hide();
			return true;
		}
		$("#password-sign-up").css("border", "2px solid red");
		$("#confirm-password").css("border", "2px solid red");
		$("#error-confirm-password").show().text("**Passwords do not match**");
			return false;
		
	}
	
	//---------This ensures that all entries are valid---------------------
	function validateAllEntries()
	{
		if(validateName(fName, errorFirstName) && validateName(lName, errorLastName) && validateEmail(emailSignUp, errorEmailSignUp) && validateMobile() && validatePassword(passwordSignUp,errorPasswordSignUp) && confirmPassword())
		{
			$("#register-overlay").show();
			$("#register-spinner").show();
			setTimeout(()=> {
				$("#register-overlay").hide();
				$("#register-spinner").hide();
			}, 2000);
			let firstName = $("#first-name").val();
			let lastName = $("#last-name").val();
			let password = $("#password-sign-up").val();
			let email = $("#email-sign-up").val();
			let mobile = $("#mobile-no").val();
			let userId = `${firstName} ${lastName}`.toLowerCase();
			let userDetails = {firstName:firstName, lastName:lastName, email:email, mobile:mobile, password:password, id:userId};
			if(!localStorage.hasOwnProperty("users"))
			{
				localStorage.setItem("users", JSON.stringify([userDetails]));
			}
			else
			{
				let isPresent = false;
				let temp = JSON.parse(localStorage.getItem("users"));
				for(let each_user of temp)
				{
					if(each_user["id"] == userId)
					{
						isPresent = true;
						break;
					}
				}
				if(!isPresent)
				{
					temp.push(userDetails);
					localStorage.removeItem("users");
					localStorage.setItem("users", JSON.stringify(temp));
				}
				
			}
			$("#first-name").val("");
			$("#last-name").val("");
			$("#password-sign-up").val("");
			$("#email-sign-up").val("");
			$("#mobile-no").val("");
			$("#confirm-password").val("");
			
		}
	}
	
	//---------------This ensures that only registered users are signed in----------
	function confirmAccountAvailability()
	{
		let emailSignIn = $("#email-sign-in");
		let passwordSignIn = $("#password-sign-in");
		let errorEmailSignIn = $("#error-email-sign-in");
		let errorPasswordSignIn = $("#error-password-sign-in");
		let signInAlert = $(".sign-in-alert");
		if(validateEmail(emailSignIn,errorEmailSignIn) && validatePassword(passwordSignIn, errorPasswordSignIn))
			
		{
			const entireRecords = JSON.parse(localStorage.getItem("users"));
			
			for(let each_user of entireRecords)
			{
				const user_detail = Object.values(each_user);
				let email = $(emailSignIn).val();
				let password = $(passwordSignIn).val();
				if(user_detail.includes(email) && user_detail.includes(password))
				{
					
					if(sessionStorage.length == 0)
					{
						$("#register-overlay").show();
						$("#register-spinner").show();
						setTimeout(()=> {
						$("#register-overlay").hide();
						$("#register-spinner").hide();
						$("#email-sign-in").val("");
						$("#password-sign-in").val("");
						$(".sign-in-alert").hide();
						}, 2000)
						loggedIn = true;
						$(".sign-in-status-comment").hide();
						let userMobile = each_user["mobile"];
						currentUserFirstName = each_user["firstName"];
						currentUserLastName = each_user["lastName"];
						
						
						$("#dropdownMenu2").show();
						$("#sign-in").hide();
						$("#logged-in-user").text(currentUserFirstName);
						//$(".sign-in-link").html(f);
						sessionStorage.setItem("currentUser", JSON.stringify({email:email, mobile:userMobile}));
					}
					else
					{
						$(signInAlert).show();
						$(".sign-in-alert span").text("You are already signed in.");
					}
					
					
				}	
				else if(!user_detail.includes(email) && user_detail.includes(password))
				{
					$(signInAlert).show();
					$(".sign-in-alert span").text("incorrect email");
					break;
				}
				else if(user_detail.includes(email) && !user_detail.includes(password))
				{
					$(signInAlert).show();
					$(".sign-in-alert span").text("incorrect password");
					break;
				}
				else
				{
					$(signInAlert).show();
					$(".sign-in-alert span").text("account does not exist");
				}
			}
		}
	}
	//---------------------------------------------------------------------------------------------------------------------------
	
	
	$(".sign-in-button").click((event) => {					//This logs the customer in
		event.preventDefault();
		confirmAccountAvailability();
	});
	
	
	$(".sign-up-button").click((event) => {					//This submits the customer's registration
		event.preventDefault();
		validateAllEntries();
	})
	
	//--------------------------This places the order and submits payment-------------------
	$(".pay-button").click(() => {
		
		const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
		if(sessionStorage.length == 0)
		{
			$(".sign-in-status").show();
		}
		else
		{
			$(".sign-in-status").hide();
			let total = Number($(".total").text());
			payWithPaystack(currentUser["email"], total, currentUser["mobile"]);
			
		}
		
	})
	
	//------------------- This takes the customers to the sign in page
	$(".sign-in-link").click((event)=> {
		if($(event.target).attr("id") == "sign-in")
		{
			$("#header-overlay").show();
			$(".log-in-out").show();
			$(".sign-in-body").show();
			$(".sign-up-body").hide();
			$(window).scrollTop(0,0);
			$("body").css("overflow","hidden");
		}
		
	});
	
	$("#sign-out").click(()=>{
		loggedIn = false;
		sessionStorage.clear();
		location.reload();
	})
	
	//---------------- This takes the customers to the sign up page --------------------------
	$('#create-account').click((event)=> {
		event.preventDefault();
		$("#header-overlay").show();
		$(".log-in-out").show();
		$('.sign-in-body').hide();
		$('.sign-up-body').show();
	})
	
	//---------------------For Date------------------------
	const getCurrentDate = function()
	{
		let date = new Date();
		let day = date.getDate();
		let month = date.getMonth() + 1;
		let year = date.getFullYear();
		let hour = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
		let minute = date.getMinutes() > 9 ? date.getMinutes() : "0"+date.getMinutes();
		let period = date.getHours() > 12 ?"pm":"am";
		
		return `${day}/${month}/${year} ${hour}:${minute}${period}`;
	}
	
	
	//--------------------This updates the cutomers' review for each product-------------------
	const updateComment = function()
	{
		//let username = $("#user-name").val();
		let username = `${currentUserFirstName} ${currentUserLastName}`;
		let rating = Number($("#rating").val());
		let comment = $("#user-comment").val();
		let productName = $("#product-id").val().toLowerCase();
		let timestamp = getCurrentDate();
		const productArr = {name:username, comment:comment, rating:rating, timestamp:timestamp};
		//$("#user-name").val("");
		$("#rating").val("");
		$("#user-comment").val("");
		$("#product-id").val("");
		if(!localStorage.hasOwnProperty(productName))
		{
			localStorage.setItem(`${productName}`, JSON.stringify([productArr]));
		}
		else
		{
			let product = JSON.parse(localStorage.getItem(`${productName}`));
			product.push(productArr);
			localStorage.setItem(`${productName}`, JSON.stringify(product));
		}
		$(".sign-in-status-comment").hide();
	}
	
	$("#send").click((event)=> {
		event.preventDefault();
		let productId = $("#product-id");
		let userComment = $("#user-comment");
		if( validateEmpty(productId) && validateRating() && validateEmpty(userComment))
		{
			if(loggedIn)
			{
				$("#comment-overlay").show();
				$("#comment-spinner").show();
				setTimeout(()=> {
					$("#comment-overlay").hide();
					$("#comment-spinner").hide();
					updateComment();
				}, 2000)
			}
			else
			{
				$(".sign-in-status-comment").show();
			}
		}
		
		
		
	})
	//----------------------------------------------------------------------------------
	
	
	//issues here yet to be resolved-------------------------
	//--------------------------------------This displays the reviews submitted by the customers on each product--------------------- 
	const renderComments = function(obj)
	{	
		$(".comment-container").append(`<h4 style='color:green;'>${obj.name}</h4>`);
		switch(obj.rating)
		{
			case 1:
				$(".comment-container").append(`<p><img src='images/one-star.png' alt='One Star Rating'></p>`);
				
				break;
			case 2:
				$(".comment-container").append(`<p><img src='images/two-star.png' alt='Two Star Rating'></p>`);
				
				break;
			case 3:
				$(".comment-container").append(`<p><img src='images/three-star.png' alt='Three Star Rating'></p>`);
				break;
			case 4:
				$(".comment-container").append(`<p><img src='images/four-star.png' alt='Four Star Rating'></p>`);
				break;
			default:
				$(".comment-container").append(`<p><img src='images/five-star.png' alt='Five Star Rating'></p>`);
				break;
		}
		$(".comment-container").append(`<blockquote style="letter-spacing:1.1px;">" ${obj.comment} "</blockquote>`);
		$(".comment-container").append(`<p style='color:green;'>${obj.timestamp}</p>`);
		$(".comment-container").append("<hr/>");
	}
	
	//----------------------------Upon clicking on the image, the customers reviews attached to it are rendered------------
	$(".products").click((event)=> {
		
		let target = $(event.target);
		if($(target).hasClass("product"))						//any of the images was clicked
		{
			let productName = $(target).prev().text();				//the figcaption containing the product name is the previous sibling
			
			let productPrice = Number($(target).next().text().match(/[0-9]+/g).toString());				//the figcaption containing the product price is the next sibling
			
			let path = productName.split(" ").join("-").toLowerCase();
			let newImage = $("<figure></figure>");
			newImage.append(`<figcaption>${productName}</figcaption>`);
			newImage.append(`<img class='img-fluid' src= 'images/${path}.jpg' alt=${productName}>`);
			newImage.append(`<figcaption>₦${productPrice}</figcaption>`);
			$(".products").html(newImage);
			
			let pName = productName.toLowerCase();
			const commentArr = JSON.parse(localStorage.getItem(`${pName}`));					
			$(".comment").text("");
			$(".comment").css("overflow-y","auto");
			$(".comment").css("max-height","680px");
			$(".comment").append("<div class='comment-container' style='overflow-y:auto; height:'90%';></div>");
			if(!commentArr)
			{
				$(".comment-container").html('<p style="color:red; text-align:center; font-style:italic; font-size:1.0rem;">No review has been submitted yet for this product.</p>');
			}
			else
			{
				
				for(let each_comment of commentArr)					
				{
					renderComments(each_comment);
				}
			}
			
		}
	})
	
	
	//-------------------------Temporary Storage for the Products--------------------------------
	const productImages = [
		{name:"Mazeratti Men Wears", price:17300},
		{name:"Hazel Makeup Kit", price:6400},
		{name:"NYC Black Suitcase", price:30250},
		{name:"Pexel Silvery Necklet", price:27200},
		{name:"Elegance Stiletto", price:14100},
		{name:"Bentley Body Perfume", price:4000},
	]
	const bagImages = [
		{name:"Detachable Leather Bag", price:7350},
		{name:"Hito Flat Bag", price:2950},
		{name:"John Vane Rubber Bag", price:5100},
		{name:"Artem African Woven Bag", price:5500},
		{name:"Louis Vuitton Leather Bag", price:7000},
		{name:"NYC Black Suitcase", price:30250},
	]
	const shoeImages = [
		{name:"Zara Suede For Ladies", price:5450},
		{name:"Bergeron White Sneakers", price:10200},
		{name:"Lukas Hilton Men", price:18500},
		{name:"Mazeratti Men Wears", price:17300},
		{name:"Elegance Stiletto", price:14100},
		{name:"Lorenzo16 Sleek Fashion", price:8000},
	]
	const cosmeticsImages = [
		{name:"Venus Cleansing Foam", price:2500},
		{name:"Venus Makeup Fix", price:2300},
		{name:"Bruket Sea Salt Scrub", price:2000},
		{name:"Hazel Makeup Kit", price:6400},
		{name:"Bentley Body Perfume", price:4000},
		{name:"Karolina Body Perfume", price:3000},
	]
	const jewelleryImages = [
		{name:"Oliveira Jewellery Pack", price:64650},
		{name:"Dima Ruby Earrings", price:110000},
		{name:"Nagare Pearls Necklace", price:34000},
		{name:"Pexel Silvery Necklet", price:27200},
		{name:"Dglorious Fashion Ring", price:33000},
		{name:"Pexel Silvery Band", price:4000},
	]
	
	
	//---------------------------------Create New Image------------------------------------
	const createImages = function(img){										//this creates a new image on the fly
		let path = img.name.split(" ").join("-").toLowerCase();
		let newImage = $("<figure></figure>");
		newImage.append(`<figcaption>${img.name}</figcaption>`);
		newImage.append(`<img class='img-fluid product' src= 'images/${path}.jpg' alt=${img.name}>`);
		newImage.append(`<figcaption>₦${img.price}</figcaption>`);
		return newImage;
	}
	
	//-----------------This loads the images to the page--------------
	const renderImages = function(imgArray){								//this displays the images created on the DOM
		const imgContainerArr = $(".img-cont");
		for(let x in imgArray)
		{
			let newImage = createImages(imgArray[x]);
			$(imgContainerArr[x]).html(newImage);
		}
	}
	
	
	//---------------------------------Text Writing and Deleting Effect----------------------------------
	function writeWords()
	{
	  let num = 0;
		let newStr = ""
		let timeOut = setInterval(() => {
		  num < textToBeEffected.length ? num++ : clearInterval(timeOut);		//run the timer only after all the letters have been printed
		  newStr = textToBeEffected.substring(0, num + 1) + "|"				//grab each consecutive numbers of letter of the sentence from the first index every 0.05s
		  document.querySelector("#moving").textContent = newStr;
		}, 50)
	}
	function deleteWords()
	{
	  let num = 0;
		let newStr = ""
		let timeOut = setInterval(() => {
		  num < textToBeEffected.length ? num++ : clearInterval(timeOut);			//run the timer only after all the letters have been printed
		  newStr = textToBeEffected.substring(0, textToBeEffected.length - 1 - num) + "|"	//grab each consecutive numbers of letter of the sentence from the last index every 0.05s
		  document.querySelector("#moving").textContent = newStr;
		}, 50)
	}

	function writingEffect()									//this creates writing effect
	{
	  setTimeout(writeWords, 0);
	  
	  setTimeout(deleteWords, (50 * textToBeEffected.length) + 1000);
	}

	function changeBackgroundImg()							//this changes the background image of the header every 5 seconds
	{
		let change = true;
		
		setInterval(() => {
			if(change)
			{
				$(".description img").attr("src","images/header-image.png");
				change = false;
			}
			else
			{
				$(".description img").attr("src","images/header-image2.png");
				change = true;
			}
		}, 5000)
	}	
	
	
	//---------------------This calculates the total price of items added to cart---------------
	const getTotal = (subTotalArray) => {		
		let total = 0;
		for(eachItem of subTotalArray)
		{
			total += eachItem[1];
		}
		return total;
	}
	
	//--------This updates and adjusts the serial numbers after every complete deletion of a particular item in the cart-------------
	const controlSerialAndTotal = () => {					
		for(let item of  $("table").find(".serialNum"))
		{
			let product = $(item).parent().find(".productName").text();
			const itemsToBePurchased = Object.keys(selectedItems);
			let serialNum = itemsToBePurchased.indexOf(product);
			$(item).text(serialNum + 1);
		}
		totalPrice = getTotal(Object.values(selectedItems));
		$(".total").text(totalPrice);								//the total is updated accordingly
	}
	
	
	$(document).ready(() => {
		$(".header").height($(window).height());
		$(".page-footer").height($(window).height() * 0.3);
		$(".description img").height($(window).height());
		$(".close").hide();
		$('sub').text(count);
		setTimeout(writingEffect, 0);
		setInterval(writingEffect, ((50 * textToBeEffected.length) + 1000) * 2);
		renderImages(productImages);
		changeBackgroundImg();
	});
	
	
	$(window).on("load", () => {				//This clears the saved password
		sessionStorage.clear();
	})
	
	
	//-------------------------------------This displays the corresponding products based on selection from the dropdown---------------
	$(".drop-down").click((event) => {
		let category = $(event.target).text();
		
		switch(category)
		{
			case "Bags":
				renderImages(bagImages);
				break;
			case "Shoes":
				renderImages(shoeImages);
				break;
			case "Shirts":
				renderImages(shirtImages);
				break;
			case "Cosmetics":
				renderImages(cosmeticsImages);
				break;
			case "Jewelleries":
				renderImages(jewelleryImages);
				break;
		}
		document.querySelector(".section-two").scrollIntoView();	//using vanilla JS
	})
	
	
	//----------------This aids the addition of items to cart-------------------------------------
	$(document).click((event) => {
		let clickedButton = event.target;
		if($(clickedButton).hasClass("add-to-cart")){
			
			let numberOfItemsSelected = $(clickedButton).parent().find(".qty").val();
			numberOfItemsSelected = Number(numberOfItemsSelected);
			if(numberOfItemsSelected > 0)
			{
				$(".cart-content-container").show();
				$(clickedButton).parent().find(".cart-alert").show().fadeOut(500);
				$("sub").text(`${count += numberOfItemsSelected}`);
				let itemAndPrice = $(clickedButton).parent().find("figcaption");
				let amount = Number($(itemAndPrice[1]).text().match(/[0-9]+/g).toString());
				let productName = $(itemAndPrice[0]).text();
				if(!store.hasOwnProperty(productName))							//add the selected item to the temporary store if it is not already present
				{
					store[productName] = amount;					
				}
				let newItem = $('<tr></tr>');
				if(selectedItems[productName])
				{
					selectedItems[productName][0] += numberOfItemsSelected;					
					selectedItems[productName][1] += (store[productName] * numberOfItemsSelected);
					for(let item of $("table").find(".quantity"))
					{
						if($(item).prev().text() == productName)
						{
							$(item).text(selectedItems[productName][0]);
							$(item).next().text(selectedItems[productName][1]);
						}
					}	
				}
				else
				{
					selectedItems[productName] = [numberOfItemsSelected, amount * numberOfItemsSelected];
					newItem.append("<td><input type='text' name='quantity' class='qty' placeholder='Qty' autofocus></td>");
					newItem.append("<td class='fa fa-trash delete-item'></td>");
					newItem.append("<td class='serialNum'></td>");
					newItem.append(`<td class='productName'>${productName}</td>`);
					newItem.append(`<td class='quantity'>${selectedItems[productName][0]}</td>`);
					newItem.append(`<td class='sub-total'>${amount * numberOfItemsSelected}</td>`);
					$(".row-total").before(newItem);
				}
				controlSerialAndTotal();
				//sessionStorage.setItem("currentUser", JSON.stringify({email:"", total:totalPrice, mobile:""}));
			}
			
			
		}
	})
	
	//-------------This creates a rotaion effect on close and open menu toggler
	$(".toggler").click(() => {
		if(pressedToggle)
		{
			$(".toggler").attr("class","fa fa-close toggler").addClass("rotate-toggler").css("transition", "transform 0.4s ease");
			pressedToggle = false;
		}
		else
		{
			$(".toggler").attr("class","fa fa-bars toggler");
			pressedToggle = true;
		}
	});
	
	
	//---------------------This collects the password entered by the users------------------
	$("#password-sign-in").on("input", ()=>{
		password = $("#password-sign-in").val();
		
	});
	
	//--------------------------This reveals and hides the password being entered---------------------
	$(".encrypt").click(()=>{
		
		if(reveal)
		{
			$("#password-sign-in").attr("type", "text");
			$("#password-sign-in").val(password);
			$(".encrypt i").attr("class","fa fa-eye-slash");
			reveal = false;
		}
		else
		{
			$("#password-sign-in").attr("type", "password");
			$("#password-sign-in").val(password);
			$(".encrypt i").attr("class","fa fa-eye");
			reveal = true;
		}
		
	})
	
	//-------------------------This closes the sign in and sign up forms---------------------------------------
	$(".hide-register").click(()=>{
		$(".log-in-out").hide();
		$("#header-overlay").hide();
		$("body").css("overflow","auto");
	})
	
	
	//-----------------This hides and reveals the cart and applies fadeout effect for 1 second --------------------
	$(".hide-cart").click(() => {
		$(".cart-content-container").fadeOut(1000);
	})
	$(".cart").click(() => {
		$(".cart-content-container").toggle();
	});
	
	
	//-----------------This aids the deletion of the items added to the cart ------------------------------------
	$(".table").click((event) => {
		let clickedButton = event.target;
		if($(clickedButton).hasClass("delete-item"))
		{
			let numberOfItemsDeleted = $(clickedButton).parent().find(".qty").val();
			let productName = $(clickedButton).parent().find(".productName").text();
			let quantity = $(clickedButton).parent().find(".quantity");
			let subTotal = $(clickedButton).parent().find(".sub-total");
			numberOfItemsDeleted = Number(numberOfItemsDeleted);
			if(numberOfItemsDeleted <= selectedItems[productName][0])
			{
				quantity.text(selectedItems[productName][0] -= numberOfItemsDeleted);
				selectedItems[productName][1] -= (store[productName] * numberOfItemsDeleted);
				subTotal.text(selectedItems[productName][1]);
				if(selectedItems[productName][0] == 0)
				{
					delete selectedItems[productName];
					$(clickedButton).parent().remove();
				}
				$("sub").text(`${count -= numberOfItemsDeleted}`);
				
			}
			controlSerialAndTotal();
			
			/* const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
			if(currentUser["email"] && currentUser["total"] && currentUser["mobile"])
			{
				
				localStorage.setItem("currentUser", JSON.stringify({email:currentUser["email"], mobile:currentUser["mobile"]}));
			}
			else
			{
				sessionStorage.setItem("currentUser", JSON.stringify({email:"", mobile:""}));
			} */
		
		}
		
	});
	
	}
)();
