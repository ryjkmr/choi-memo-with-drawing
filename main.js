document.addEventListener('DOMContentLoaded', function () { //windows.onloadは複数使えないので代わり
	console.log("loaded");
	window.addEventListener("beforeprint", function (event) {
		let textarea = document.getElementById('reading_text');
		let print_div = document.getElementById('print_div');
		print_div.innerText = textarea.value;

	});

	window.addEventListener("afterprint", function (event) {
		document.getElementById('print_div').innerText = '';
	});

	const inputElement = document.getElementById('reading_text');
	inputElement.addEventListener('keyup', processText, false);

	document.getElementById('removeCRLF').addEventListener('click', removeCRLF, false);
	document.getElementById('copy').addEventListener('click', copy, false);

	inputElement.addEventListener('compositionend', function (e) {
		const data = e.data;
		switch (data) {
			case "「":
				complete_quote(inputElement, '」');
				break;
			case "\”":
				replace_quote(inputElement, '“”');
				break;
			case "｛":
				complete_quote(inputElement, '｝');
				break;
			case "『":
				complete_quote(inputElement, '』');
				break;
			case "’":
				replace_quote(inputElement, '‘’');
				break;
			case "【":
				complete_quote(inputElement, '】');
				break;

			case "［":
				complete_quote(inputElement, '］');
				break;
			case "（":
				complete_quote(inputElement, '）');
				break;

			default:
				break;
		}

	});

	document.getElementById('calculate_text').addEventListener('change', function (e) {
		console.log('calc!');
		const result = evalCalculation(this.value);
		document.getElementById("calculate_result").innerText = result;
	});

	function removeCRLF() {
		let textarea = document.getElementById('reading_text');
		//textarea.value = textarea.value.replace(/\r?\n/g, '');
		textarea.value = textarea.value.replace(/([^\r\n]+)(\r|\r\n|\n)/g, '$1').replace(/((\r|\r\n|\n)+)/g, '$1\n');
	}

	function copy() {
		let textarea = document.getElementById('reading_text');
		textarea.select();
		document.execCommand("copy");
	}


	//後ろに補完する関数
	function complete_quote(element, charactor) {
		const content = element.value;
		const len = content.length;
		const pos = element.selectionStart;
		element.value = content.substr(0, pos) + charactor + content.substr(pos, len);
		element.setSelectionRange(pos, pos);
	}

	//そっくり入れ替える関数
	function replace_quote(element, charactor) {
		const content = element.value;
		const len = content.length;
		const pos = element.selectionStart;
		element.value = content.substr(0, pos - 1) + charactor + content.substr(pos, len);
		element.setSelectionRange(pos, pos);
	}



	function processText(str) {
		str = inputElement.value;
		//文字数
		document.getElementById("inputlength").innerText = str.length;

		//ワードカウント
		document.getElementById("word_count").innerText = str.replace(/\s/g, ' ').split(' ').filter(v => v).length;

		//文章内の数字の合計計算（かけ算付き）
		const tempNumArr = str.replace(/\s*\*\s*/g, '*').replace(/[^0-9\.\*]/g, ' ').split(' ').filter(v => v);
		const numArr2 = tempNumArr.map((arr) => {
			arrayForMultiply = arr.split('*');
			if (arrayForMultiply.length > 1) {
				let result = 1;
				for (let i = 0; i < arrayForMultiply.length; i++) {
					if (arrayForMultiply[i] !== '') { result = result * Number(arrayForMultiply[i]) };
				}
				return result;
			} else {
				return arr;
			}
		});

		if (numArr2.length > 0) {
			const calc_temp = numArr2.reduce(function (a, x) { return Number(a) + Number(x); });
			document.getElementById("calc_multi_sum").innerText = calc_temp;
			document.getElementById("calc_multi_sum_ava").innerText = Math.round(calc_temp / numArr2.length * 100) / 100;
		} else {
			document.getElementById("calc_multi_sum").innerText = '0';
			document.getElementById("calc_multi_sum_ava").innerText = '0';
		}

		//文章内の数値の単純合計
		const numArr1 = tempNumArr.map((val) => { return val.split('*') }).flat().filter(v => v);
		if (numArr1.length > 0) {
			const calc_temp = numArr1.reduce(function (a, x) { return Number(a) + Number(x); });
			document.getElementById("calc_sum").innerText = calc_temp;
			document.getElementById("calc_sum_ava").innerText = Math.round(calc_temp / numArr1.length * 100) / 100;
			document.getElementById("calc_howmany").innerText = numArr1.length;
		} else {
			document.getElementById("calc_sum").innerText = '0';
			document.getElementById("calc_sum_ava").innerText = '0';
			document.getElementById("calc_howmany").innerText = '0';
		}
	}


});