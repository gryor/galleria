function Galleria(options) {
	options = options ||  {};
	var galleria = $('#' + (options.id || 'galleria'));
	var categories = options.categories || {};

	function clear() {
		$('html, body').scrollTo(document.body);
		galleria.empty();
	}

	function remove(e) {
		galleria.remove(e);
	}

	function loadImage(src, parent, onload, onerror) {
		var image = new Image;

		image.onload = function() {
			if ('naturalHeight' in this) {
				if (this.naturalHeight + this.naturalWidth === 0) {
					this.onerror();
					return;
				} else {
					onload(image);
				}
			} else if (this.width + this.height == 0) {
				this.onerror();
				return;
			} else {
				onload(image);
			}
		};

		image.onerror = function() {
			image = null;

			if (onerror)
				onerror(parent, image);
		};

		image.src = src;
		parent.appendChild(image);
	}

	function showCategories() {
		clear();

		for (id in categories) {
			if (!categories[id]) {
				delete categories[id];
				continue;
			}
			addCategory(id, categories[id]);
		};

		$('html, body').scrollTo(document.body);
	}

	function showCategory(categoryId) {
		clear();

		categories[categoryId].images.forEach(showImage);
		$('html, body').scrollTo(document.body);
		$('.galleria-image').last().off('click').click(function(e) {
			e.preventDefault();
			e.stopPropagation();
			showCategories();
		});
	}

	function showImage(image) {
		var div = document.createElement('div');

		loadImage(image.src, div, function(img) {}, function(parent, image) {
			//$(parent).empty();
			//remove(parent);
		});

		div.dataset.id = image.id;
		div.className = "galleria-image";

		if (options.deleteImage) {
			var divdelete = document.createElement('div');
			var span = document.createElement('span');

			divdelete.className = 'galleria-image-delete';
			span.className = 'glyphicon glyphicon-remove-circle';

			$(span).click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				$(div).empty();
				$(div).remove();
				options.deleteImage(image.parent, image.id);
			});

			divdelete.appendChild(span);
			div.appendChild(divdelete);
		}

		$(div).click(function() {
			$('html, body').scrollTo($(this).next());
		});

		galleria.append(div);
	}

	function addCategory(id, info) {
		if (!info || !info.images) {
			if (categories[id])
				delete categories[id];
			return;
		}

		if (!categories[id])
			categories[id] = info;

		var div = document.createElement('div');
		var title = document.createElement('div');
		var p = document.createElement('p');

		loadImage(info.images[0].src, div, function(img) {}, function(parent, image) {
			//$(parent).empty();
			//remove(parent);
		});

		div.dataset.id = id;
		div.className = "galleria-category";
		title.className = "galleria-category-title";
		p.innerHTML = info.subject;

		title.appendChild(p);
		div.appendChild(title);

		$(div).click(function() {
			showCategory(this.dataset.id);
		});

		if (options.deleteCategory) {
			var divdelete = document.createElement('div');
			var span = document.createElement('span');

			divdelete.className = 'galleria-category-delete';
			span.className = 'glyphicon glyphicon-remove-circle';

			$(span).click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				$(div).empty();
				$(div).remove();
				options.deleteCategory(info);
			});

			divdelete.appendChild(span);
			div.appendChild(divdelete);
		}

		galleria.append(div);
	}

	Object.defineProperty(this, 'categories', {
		get: function() {
			return categories;
		}
	});

	publishFunction(this, 'clear', clear);
	publishFunction(this, 'showCategories', showCategories);
	publishFunction(this, 'showCategory', showCategory);
	publishFunction(this, 'addCategory', addCategory);
}