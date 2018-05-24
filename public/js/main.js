$(document).ready(function(){
	$('.deleteStudent').on('click', deleteStudent);
});
function deleteStudent(){
	var confirmation = confirm('Are You Sure?');
	if(confirmation){
		$.ajax({
			type:'DELETE',
			url:'/students/delete/'+ $(this).data('id')
		}).done(function(response){
			window.location.replace('/');
		});
		
	//window.location.replace("/");
	} else{
		return false;
	}
}

