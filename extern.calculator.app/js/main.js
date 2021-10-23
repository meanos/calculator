var win = nw.Window.get();
win.width = 670;

win.showDevTools();

		/*window.MathJax = {
				"fast-preview": {
       					disabled: true
				},
				AuthorInit: function() {
					MathJax.Hub.Register.StartupHook('End', function() {
						MathJax.Hub.processSectionDelay = 0
						var demoSource = document.getElementById('advancedCalcsInput')
						var demoRendering = document.getElementById('lols')
						var math = MathJax.Hub.getAllJax('demoRendering')[0]
						console.log("math: ",math);
						demoSource.addEventListener('input', function() {
							console.log("ok ok: ",demoSource.value);
							//MathJax.Hub.Queue(['Text', math, demoSource.value])
						})
					})
				}
		}*/

var x = nerdamer('diff(x^4-2x^3, x)');

    console.log(x.toString());


var index = 0;
var numbers = [new Big(0)];
var normalNumber = true;
var firstNumber = true;

function openAdvancedMode() {
	$("#simpleMath").addClass("hidden");
	$("#advancedMath").removeClass("hidden");

}

$(document).ready(() => {
	$(document).on("keydown", (e) => {
		if (/^([0-9]*)$/.test(e.key)) addNumber(e.key);
		if (e.keyCode == 8) removeNumber();
		if (e.keyCode == 107) nextNumber("+");
		if (e.keyCode == 109) nextNumber("-");
		if (e.keyCode == 106) nextNumber("*");
		if (e.keyCode == 111) nextNumber("/");
		if (e.keyCode == 13) operationCalculate();
		if (e.keyCode == 46) clearEntry();
	});
});

setTimeout(function(){
		$("#tips").addClass("font-size-fix");
		}, 2000);

function addNumber(number) {
	if (!normalNumber) numbers[index] = new Big(0);
	normalNumber = true;
	numbers[index] = numbers[index].times(10).plus(Number(number));
	$("#calcEntry").val(numbers[index]);
}

function removeNumber() {
	numbers[index] = numbers[index].div(10);
	numbers[index] = Big(Math.floor(numbers[index]));
	$("#calcEntry").val(numbers[index]);
}

function addPi() {
	numbers[index] = Math.PI;
	$("#calcEntry").val(numbers[index]);
	normalNumber = false;
}

function clearEntry() {
	numbers[index] = new Big(0);
	$("#calcEntry").val(numbers[index]);
}

function clearAll() {
	numbers = [];
	index = 0;
	clearEntry();
	firstNumber = true;
	$("#calcOperations").val(" ");
}

function nextNumber(sign) {
	$("#calcOperations").val(function () {
		return this.value
			? this.value + numbers[index] + " " + sign + " "
			: numbers[index] + " " + sign + " ";
	});
	numbers[++index] = new Big(0);
	calculate();
}

function operationCalculate() {
	calculate();
	$("#calcOperations").val("");
}

function calculate() {
	$("#calcEntry").val(() => {
		if (!firstNumber)
			return new Big(Number(eval($("#calcOperations").val() + numbers[index])));
		firstNumber = false;
		return numbers[index];
	});

	numbers = [new Big(0)];
	index = 0;
}

function exp() {
	$("#calcEntry").val(() => {
		return numbers[index] + '.e+0';
	});
}


/*Advanced Maths calculations*/

/* Formats maths string so that it looks clean. However, this implimentation sucks as I'm not good with regex*/


function getInputResults(input) {
	if (input.indexOf("f(") == 0) {
		//var variableToMonitor = input[2];
		//$("#demoRendering").empty();
		//$("#demoRendering").append("`"+input+"`");
		var matches = input.match(/\((.*?)\)/);
		if (matches) {
			var variableToMonitor = matches[1];
			if (input.split("=").length == 2) {
				var equation = input.split("=")[1];
				console.log("f(x) = ",variableToMonitor);
				console.log("equation: ",equation);
				try {
					var def1 = nerdamer('diff('+equation+', '+variableToMonitor+')');
					var def2 = nerdamer('diff('+equation+', '+variableToMonitor+', 2)');
					var def3 = nerdamer('diff('+equation+', '+variableToMonitor+', 3)');
					var solutions = nerdamer(equation).solveFor(variableToMonitor).toString().split(",");
					console.log("def1: ",def1);
					console.log("zeros: ",solutions);
					var zeros = '';
					if (solutions.length > 0) {
						zeros +='<h3 class="block-title">Zeros</h3>';
						for (var i = 0; i < solutions.length; i++) {
							zeros += '<p> `'+variableToMonitor+'_'+(i+1)+' = '+solutions[i]+'` </p>';
						}
					}

					console.log("gets here:")
					
				$("#dynamicOutput").empty();
					$("#dynamicOutput").append('<h1> `'+input+'` </h1>'+
					zeros+
					'<h3 class="block-title">Derivatives</h3>'+
					"<p> `f'("+variableToMonitor+") = "+def1+'` </p>'+
					"<p> `f''("+variableToMonitor+") = "+def2+'` </p>'+
					"<p> `f'''("+variableToMonitor+") = "+def3+'` </p>'
					);
					
					if ($("#advancedCalcOut").hasClass("hidden")) {
						$("#tips").addClass("hidden");
						$("#advancedCalcOut").removeClass("hidden");
					}

					var equationModified = equation.replace(new RegExp(variableToMonitor, 'g'),"x"); //FIXME: alternative solution is preffered
					
					console.log("equationModified: ",equationModified);
					var instance = functionPlot({
						target: '#graphOutput',
						
						color: 'pink',
						data: [{
							fn: equationModified
							}]
					});
					$("#graphOutput").removeClass("hidden");
					for (var i = 0; i < functionPlot.globals.COLORS.length; i++)
						functionPlot.globals.COLORS[i] = d3.hsl('white')

						

					console.log(functionPlot.globals.COLORS)
					instance.draw()
				} catch (e) {
					console.log("error: ",e),
					$("#advancedCalcOut").addClass("hidden");
					$("#tips").removeClass("hidden");
				}
				window.MathJax.Hub.Typeset();
				
				
			} else {
				console.log("not fx yet")
			}
		}
		
		
		
	}
}


var oldInput = "";

$('#advancedCalcsInput').change(function(){
		console.log("input changed");
		if (oldInput != $("#advancedCalcsInput").val())
				  	if ($("#advancedCalcsInput").val() == "") {
						$("#advancedCalcOut").addClass("hidden");
						$("#tips").removeClass("hidden");
					  } else {
						  getInputResults($("#advancedCalcsInput").val());
					  }
	});

		  	$("#advancedCalcsInput").keyup(function (e) {
				  //var x = nerdamer('diff(x^4-2x^3, x)');
				  
				  //console.log(x.toString());
				  if (oldInput != $("#advancedCalcsInput").val())
				  	if ($("#advancedCalcsInput").val() == "") {
						$("#advancedCalcOut").addClass("hidden");
						$("#tips").removeClass("hidden");
					  } else {
						  getInputResults($("#advancedCalcsInput").val());
					  }
					  	
				
				oldInput = $("#advancedCalcsInput").val();

			if (e.keyCode == 13) { //Press ENTER

				//enter pressed
			}
		});

	function enterCustomExpression(expression) {
		$("#advancedCalcsInput").val(expression).change();
	}