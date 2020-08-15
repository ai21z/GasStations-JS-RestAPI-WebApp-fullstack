$(document).ready(function () {
 // LOGIN HANDLING  
   $('#login_button').off('click').click(function (e) {
      e.preventDefault();
      $.ajax({
         url: '/api/v1/login',
         data: $('#logform').serialize(), 
         dataType: 'JSON',
         type: 'POST',
         success: (data) => {
            if (data.error) {               
               $('#loginAlerts .alert.alert-danger').html(data.error).css({ 'display': 'block' });
               setTimeout(() => {
                  $('#loginAlerts .alert.alert-danger').css({ 'display': 'none' });
               }, 3000)
            } else {
               $('#loginModal').modal('hide');
               window.location.reload();
            }
         },
         error: function () {
            console.log('There was a problem.');
         }
      });
   });

//SIGNUP HANDLING
   $('#signup_button').off('click').click(function (e) {
      e.preventDefault();
      $.ajax({
         url: '/api/v1/signup',
         data: $('#regform').serialize(),
         dataType: 'JSON',
         type: 'POST',
         success: function (data) {
            if (data.error) {
               $('#signAlerts .alert.alert-danger').html(data.error).css({ 'display': 'block' });
               setTimeout(() => {
                  $('#signAlerts .alert.alert-danger').css({ 'display': 'none' });
               }, 3000)
            } else {
               $('#signupModal').modal('hide');
               window.location.reload();
            }
         },
         error: function () {
            console.log('There was a problem.');
         }
      });
   });

//ORDER FORM
   $('#order_button').off('click').click(function (e) {
      e.preventDefault();
      $('input[name=when]').val(moment($('input[name=when]').val()).format("YYYY-MM-DD HH:mm:ss"));
      $.ajax({
         url: '/order',
         data: $('#orderform').serialize(),//παιρνει τα input του form 
         dataType: 'JSON',
         type: 'POST',
         success: function (data) {
            if (data.success) {
               console.log('sent!>');
            }
         },
         error: function () {
            console.log('There was a problem. Order not sent!');
         }
      });
   });
  
//CALENDAR IN ORDERS
   $(function () {
      $('#datetimepicker1').datetimepicker();
   });

});

//CURTAIN MENU
/* Open when someone clicks on the span element */
function openNav() {
   document.getElementById("myNav").style.width = "100%";
 }
 
 /* Close when someone clicks on the "x" symbol inside the overlay */
 function closeNav() {
   document.getElementById("myNav").style.width = "0%";
 } 


//CHARTS
// Load Charts and the corechart and barchart packages.
google.charts.load('current', { 'packages': ['corechart'] });

// Draw the pie chart and bar chart when Charts is loaded.
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

   var data = new google.visualization.DataTable();
   data.addColumn('string', 'Topping');
   data.addColumn('number', 'Slices');
   data.addRows([
      ['Min', 3],
      ['Avg', 1],
      ['Max', 1],

   ]);

   var piechart_options = {
      title: 'Τιμές αγοράς',
      width: 400,
      height: 300
   };
   var piechart = new google.visualization.PieChart(document.getElementById('piechart_div'));
   piechart.draw(data, piechart_options);

   var barchart_options = {
      title: 'Τιμές αγοράς',
      width: 400,
      height: 300,
      legend: 'none'
   };
   var barchart = new google.visualization.BarChart(document.getElementById('barchart_div'));
   barchart.draw(data, barchart_options);
}


//COUNTERS
$.get("/stats/price", function (data) {
   $('#minPrice').html(data.Stats.minPrice);
   $('#maxPrice').html(data.Stats.maxPrice);
   $('#avgPrice').html(data.Stats.avgPrice);
   $('#gasCount').html(data.CountGas.count);
   $(function(){
      $('.count-number').counterUp({
         delay: 10,
         time: 1000
      })
   })
});

