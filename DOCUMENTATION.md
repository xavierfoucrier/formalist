# Formalist documentation
Here you will find the documentation describing on how to use the jQuery plugin.


## Summary
1. [How it works](#how-it-works)
2. [Markup](#markup)
3. [Calling](#calling)
4. [Options](#options)
5. [Examples](#examples)
6. [Demos](#demos)


## How it works
Formalist allows you to create specific **conditional web forms**: this means it can automate and facilitate the realization of web forms **similar to conditional trees** in different combinations which are defined to go from point A to point B. Unlike a conventional form in which you must encode all your conditions in javascript, Formalist offers you the opportunity to make them flexible by **integrating them directly into the HTML source** of your form so you can easily change them later without rewriting a piece of code. Don't forget that **Formalist is not a validator**: it will not help you validate your form and checking your input fields before submit.


## Markup
### Box
The box is a group of elements, it represents the **different sections of the form** and generally contains input fields. By default on Formalist, a box is a div with a css class named `box`. Formalist targets the box with the jQuery class selector (`.classname`) that checks the css class name of an element so you can **easily define your own css class** for pointing on a specific element of your form: see the `box` option for more informations.

```html
<form id="form1">
	<div class="box">
		<!-- here goes your input fields -->
	</div>
	<div class="box">
		<!-- here goes other input fields -->
	</div>
</form>
```

### Data attributes
Formalist is using **two specific HTML5 attributes**:

- `data-hide`: literally "hide this item when ..."
- `data-show`: literally "show this item when ..."

These HTML5 attributes are defined **manually on every box** present in the form and can be set up in different ways:

- with a textual value of a field, `value`: literally "hide/show this item when there is a field with this specific value defined in the form"
- with a field name, `name`: literally "hide/show this item when there is a field with this specific name defined in the form"
- with a field identifier, `id`: "hide/show this item when there is a field with this specific identifier defined in the form"
- with a star, `*`: "hide/show this item whatever happens"

You are not obliged to defined the two attributes on each box: a box without data attributes will not be able to interact with Formalist. Keep in mind that:

- Formalist is taking the HTML5 attributes **with a priority order**: `data-hide` has priority over `data-show`.
- Formalist is taking this parameters with a priority order: `value` has priority over `name` that has priority over `id`.

### CSS
Don't forget to set up the stylesheet class in your css file. If not set, Formalist will not be able to do anything on the form. A very basic example for setting up your css may be:

```css
.hidden {display:none;}
.visible {display:block;}
```

Note that if you are interested to make your form visually awesome, you can add some css animations or css transitions on those classes for creating nice effects and attracting the visitor's attention.


## Calling
Instantiate and calling the plugin is **very easy**. Just start by include the jQuery library and the plugin on your web page using the generic script markup:

```js
<script type="text/javascript" src="jquery.min.js"></script>
<script type="text/javascript" src="formalist.min.js"></script>
```

Then call the plugin by using the default plugin call syntax of jQuery:

```js
$(function(){
	$('#form1').formalist();
});
```

You can call the plugin with **multiple form identifiers** *(comma-separated)*, like this:

```js
$(function(){
	$('#form1,#form2,#form3').formalist();
});
```

The calling is different if you want to call the plugin with custom options:

```js
$(function(){
	$('#form1').formalist({
		selector: 'input[class="radio"]',
		event: 'click,dblclick'
	});
});
```


## Options
### Quick reference
Formalist call with all default options as defined in the source.

```js
$('#form1').formalist({
	
	// elements on which Formalist is applied (basically "input fields")
	selector: ':radio,:checkbox,select',
	
	// event bound by Formalist (attached to input fields)
	event: 'change',
	
	// the "box" on which the HTML5 "data-" attributes are specified (span, div, fieldset, etc.)
	box: 'div.box',
	
	// elements present in a box on which Formalist is applied when running in cascade
	cascade: ':radio:checked:visible,:checkbox:checked:visible,select:visible option:selected',
	
	// css class used on hidden box
	classwhenhidden: 'hidden',
	
	// css class used on visible box
	classwhenvisible: 'visible',
	
	// callback's method used when hidding a box
	hide: function(box) {hide(box);},
	
	// callback's method used when showing a box
	show: function(box) {show(box);},
	
	// callback's method used for the correlation between the input fields and the box
	correlate: function(box, field, type, value, name, id) {return correlate(box, field, type, value, name, id);}
});
```

### Complete reference
Formalist reference that details all options of the plugin.

#### selector
Type: `String`
Default: `:radio,:checkbox,select`

The selector allows you to define all the elements with which the Formalist plugin will **interact**. By default only fields such as radio, checkbox and select are taken into account because these are the most popular input fields used in conditional forms.

#### event
Type: `String`
Default: `change`

The event bound by Formalist and attached to the input fields of the form. By default, Formalist binds the `change` event to take control of all input defined in the `selector` option. You can pass **more that one event to this option** which must be a comma-separated value.

#### box
Type: `String`
Default: `div.box`

The box represents the element on which the HTML5 `data-` attributes are defined and **generally contains other elements that are bound by Formalist**. It can be of any type, like `span`, `div`, `fieldset`, etc.. The box must be inside of the form to properly work.

#### cascade
Type: `String`
Default: `:radio:checked:visible,:checkbox:checked:visible,select:visible option:selected`

The cascade option is a constraint defined to allow Formalist to run in "cascade". When an element present on a box matches the cascade constraint, Formalist will run through this object and then checks if another object is "cascade ready" on the matched box. After that, the plugin re-checks the matched box and then search for another object matching the cascade constraint, etc.. **The plugin loops until the latest cascade constraint is reached**.

#### classwhenhidden
Type: `String`
Default: `hidden`

The name of the css class used **on hidden box**.

#### classwhenvisible
Type: `String`
Default: `visible`

The name of the css class used **on visible box**.

#### hide
Type: `Function`
Return: `Nothing`
Default: `function(box) {hide(box);}`

Hide is a callback method **called when hidding a box**. You can override the default method of Formalist by adding your own function here: for example, if you want to make some actions before hidding the box, you can define a function on this parameter that does the stuff you want. By default, Formalist calls the internal `hide(box);` method of the plugin that removes the css class `classwhenvisible` and adds the css class `classwhenhidden` on the specified box.

#### show
Type: `Function`
Return: `Nothing`
Default: `function(box) {show(box);}`

Show is a callback method **called when showing a box**. You can override the default method of Formalist by adding your own function here: for example, if you want to make some actions before showing the box, you can define a function on this parameter that does the stuff you want. By default, Formalist calls the internal `show(box);` method of the plugin that removes the css class `classwhenhidden` and adds the css class `classwhenvisible` on the specified box.

#### correlate
Type: `Function`
Return: `Boolean`
Default: `function(box, field, type, value, name, id) {return correlate(box, field, type, value, name, id);}`

Correlate is a callback method **called for the correlation between the input fields and the box**. You can override the default method of Formalist by adding your own function here. This method must return a boolean to properly work: if `True`, Formalist will call the `hide()` method, otherwise, the `show()` method will be called. This function allow you to directly access to some properties of the current object: **take a look at the input demo** to see an example of how override this method.


## Examples
Some examples working with the default plugin options.

### Basic example

```html
<form id="form1">
	<div class="box">
		<label><input type="checkbox" name="choice" id="yes" value="Yes" />Yes</label>
		<label><input type="checkbox" name="choice" id="no" value="No" />No</label>
	</div>
	<div class="box" data-show="yes">
		You choose "yes"
	</div>
	<div class="box" data-show="no">
		You choose "no"
	</div>
</form>
```

```js
$(function(){
	$('#form1').formalist();
});
```

This example behaves this way:

- click on "Yes" shows the box having `data-show="yes"` attribute
- click on "No" shows the box having `data-show="no"` attribute
- when "Yes" or "No" are checked, the associated box are both visible
- when "Yes" or "No" are unchecked, the associated box are both hidden


## Demos
Some html demos are available and listed below. Please don't forget to read the **[compatibility section](https://github.com/xavierfoucrier/formalist/blob/master/README.md#compatibility)** before testing them.

1. [Basic demo](https://xavierfoucrier.github.io/formalist/index.html) - a simple demo with checkboxs
2. [Cascade demo](https://xavierfoucrier.github.io/formalist/cascade.html) - cascade demo that shows a multiple nested lists
3. [Input demo](https://xavierfoucrier.github.io/formalist/input.html) - custom options demo with an input field of type text
4. [Style demo](https://xavierfoucrier.github.io/formalist/style.html) - pretty css demo to make your form visually awesome

Note that all demos are using jQuery 2.0.3 and the latest version of Formalist from the Github repository.
