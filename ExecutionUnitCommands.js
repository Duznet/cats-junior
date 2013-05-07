define('ExecutionUnitCommands', ['jQuery', 'jQueryUI', 'jQueryInherit', 'Misc'], function(){

	var CommandArgument = $.inherit({
		__constructor: function(){
			this.domObject = undefined;
			this.value = undefined;
		},

		initializeArgumentDomObject: function(command, index) {
			this.domObject = $(command).children('.testFunctionArgument:eq(' + index + ')');
		},

		updateValueInDomObject: function() {
			if (!this.domObject || this.value == undefined) {
				throw 'Can\'t update values';
			}

			this.setValue(this.value);
		}
	});
	
	var CommandArgumentSelect = $.inherit(CommandArgument, {
		__constructor : function(options) {
			this.options = options.clone();
			this.__base();
		},
		
		clone: function() {
			return new CommandArgumentSelect(this.options);
		},

		generateDomObject: function(prev, callback, problem, value) {
			select = $('<select class="testFunctionArgument"></select>').insertAfter(prev);
			for (var i = 0; i < this.values.length; ++i) {
				$(select).append('<option value="' + this.values[i][0] + '">' + this.values[i][1] + '</option><br>');
			}
		
			$(select).change(function() {
				callback();
			});

			if (value) {
				$(select).val(value);
				this.value = value;
			}

			this.domObject = select;
			return this.domObject;
		},

		findValue: function(value) {
			for (var i = 0; i < this.values.length; ++i) {
				if (this.values[i][0] == value || this.values[i][1] == value) {
					return this.values[i][0];
				}
			}

			return undefined;
		},

		addArguments: function(args, clear) {
			if (!this.domObject) {
				throw 'Select isn\'t initialized';
			}	
			if (clear) {
				$(this.domObject).children(':gt(' + (this.values.length - 1) + ')').remove();
			}

			for (var i = 0; args && i < args.length; ++i) {
				$(this.domObject).append('<option value="' + args[i] + '">' + args[i] + '</option><br>');
			}
		},

		setValue: function(value, afterDomCreation) {
			if (!this.domObject) {
				throw 'Select isn\'t initialized';
			}	
			this.value = value;
			$(this.domObject).val(value);
		},

		getExpression: function() {
			if (!this.domObject) {
				throw 'Select isn\'t initialized';
			}	
			return $(this.domObject).children('option:selected').val();
		},
		
		getValue: function(args) {
			if (!this.domObject) {
				throw 'Select isn\'t initialized';
			}	
			var value = this.getExpression();
			return (args == undefined || args[value] == undefined) ? value : args[value];
		},

		setDefault: function(){
			$(this.domObject).mySpin('disabled', false);
		},
		
		updateInterface: function(newState){
			switch (newState) {
				case 'START_EXECUTION':
					$(this.domObject).prop('disabled', true);
					break;
				case 'FINISH_EXECUTION':
					$(this.domObject).mySpin('disabled', false);
					break;
			}
		}
	});
	
	var CommandArgumentSpin = $.inherit(CommandArgument, {
			__constructor : function(minValue, maxValue, isCounter) {
			this.minValue = minValue;
			this.maxValue = maxValue;
			this.isCounter = isCounter;
			this.__base();
		},

		clone: function() {
			return new CommandArgumentSpin(this.minValue, this.maxValue, this.isCounter);
		},	

		generateDomObject: function(prev, callback, problem, value) {
			var spin = $('<spin class="testFunctionArgument"></spin>');
			spin.mySpin('init', $(prev).parent(), [], problem, 'int', this.isCounter, this.minValue, this.maxValue);
			$(prev).after(spin);
			if (value != undefined) {
				this.setValue($(spin), value, true);
				this.value = value;
			}
			this.domObject = spin;
			return this.domObject;
		},

		findValue: function(value) {
			if(!isInt(value)  && !isInt(parseInt(value)) || value < this.minValue || value > this.maxValue)
				return undefined;
			return value;
		},

		addArguments: function(args, clear) {
			$(this.domObject).mySpin('setArguments', args);
		},

		setValue: function(value, afterDomCreation) {
			if (isInt(value) || checkNumber(value)) {
				$(this.domObject).mySpin('setTotal', isInt(value) ? value : parseInt(value));
			}
			else {
				if (!checkName(value)) {
					throw 'Некорректный аргумент';
				}
				$(this.domObject).mySpin('setTotalWithArgument', value, afterDomCreation); //wa for the case when we've just created new element and haven't set arguments yet
			}
			this.value = value;
		},

		getExpression: function() {
			if (!this.domObject) {
				throw 'Select isn\'t initialized';
			}	
			return $(this.domObject).mySpin('getTotalValue');
		},
		
		getValue: function(args) {
			if (!this.domObject) {
				throw 'Select isn\'t initialized';
			}	
			var value = $(this.domObject).mySpin('getValue');
			return (args == undefined || args[value] == undefined) ? value : args[value];
		},

		setDefault: function(){
			$(this.domObject).mySpin('setDefault');
			$(this.domObject).mySpin('showBtn');
		},

		updateInterface: function(newState){
			switch (newState) {
				case 'START_EXECUTION':
					$(this.domObject).mySpin('hideBtn');
					break;
				case 'FINISH_EXECUTION':
					$(this.domObject).mySpin('showBtn');
					break;
			}
		},

		decreaseValue: function() {
			$(this.domObject).mySpin('decreaseValue');
		}
	});	

	var ExecutionUnitCommand = $.inherit({
		__constructor: function(name, handler, args) {
			this.name = name;
			this.handler = handler;
			this.arguments = args.clone();
			this.hasCounter = false;

			for (var i = 0; i < args.length; ++i) {
				if (args[i].isCounter) {
					this.hasCounter = true;
					break;
				}
			}
		},
		
		getArguments: function() {
			return this.arguments;
		}
	});

	return{
		CommandArgumentSelect: CommandArgumentSelect,
		CommandArgumentSpin: CommandArgumentSpin,
		ExecutionUnitCommand: ExecutionUnitCommand
	};
});