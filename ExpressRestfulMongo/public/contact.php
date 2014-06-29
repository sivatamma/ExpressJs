<?php
	// ========== Enter your e-mail address here ========== //
	$to = 'info@fuviz.com';
	
	$name=$_REQUEST['name'];
	$email=$_REQUEST['email'];
	$subject = $_REQUEST['subject'];
	
	if($subject==""){
		$subject = 'REEN Contact Form';
	}
	
	$message=$_REQUEST['message'];
	
	$body = "Name: \t$name \nEmail: \t$email \n\nMessage: \n\n$message";
	$headers = 'From: '.$name.' <'.$email.'>' . "\r\n" . 'Reply-To: ' . $email;
	
	mail($to, $subject, $body, $headers);
?>