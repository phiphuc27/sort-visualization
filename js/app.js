const canvas = document.querySelector('#sortCanvas');
const bar = canvas.getContext('2d');
const generateBtn = document.querySelector('#generateBtn');

const quickSortBtn = document.querySelector('#quickSortBtn');
const mergeSortBtn = document.querySelector('#mergeSortBtn');
const selectionSortBtn = document.querySelector('#selectionSortBtn');
const bubbleSortBtn = document.querySelector('#bubbleSortBtn');

const barCountSlider = document.querySelector('input[type=range]');
const barCountLabel = document.querySelector(`label[for=${barCountSlider.id}]`);

let barCount = barCountSlider.value;

const barColor = '#3da4ab';
const pivotColor = '#882100';
const swapColor = '#F9F871';
const partitionColor = '#5CCEA3';

let x = 0;
let y = 0;

let sortArray = [];

const getRandomNumber = (min, max) => {
	min = Math.ceil(min);
	max = Math.ceil(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const sleep = ms => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

const generateArray = () => {
	sortArray = [];
	for (let i = 0; i < barCount; i++) {
		const value = getRandomNumber(5, 600);
		sortArray.push({ value, color: barColor });
	}
	window.requestAnimationFrame(draw);
};

const swap = async (arr, left, right) => {
	await sleep(1 + ((500 - barCount) * 1) / 100);

	let tmp = arr[left].value;
	arr[left].value = arr[right].value;
	arr[right].value = tmp;
};

const draw = () => {
	const barWidth = canvas.width / barCount;
	bar.clearRect(0, 0, canvas.width, canvas.height);
	sortArray.forEach((item, index) => {
		x = barWidth * index;
		bar.fillStyle = item.color;
		bar.fillRect(x, y, barWidth, item.value);
		bar.strokeStyle = '#f3f3f3';
		bar.strokeRect(x, y, barWidth, item.value);
	});
	window.requestAnimationFrame(draw);
};

/* QUICK SORT */

const partition = async (arr, start, end) => {
	for (let i = start; i <= end; i++) {
		arr[i].color = partitionColor;
	}
	let pivotIndex = Math.floor((start + end) / 2);
	arr[pivotIndex].color = pivotColor;
	const pivot = arr[pivotIndex].value;
	let left = start;
	let right = end;

	while (left <= right) {
		arr[left].color = swapColor;
		arr[right].color = swapColor;
		while (arr[left].value < pivot) {
			arr[left].color = partitionColor;
			left++;
			arr[left].color = swapColor;
		}
		while (arr[right].value > pivot) {
			arr[right].color = partitionColor;
			right--;
			arr[right].color = swapColor;
		}
		if (left <= right) {
			await swap(arr, left, right);

			arr[left].color = partitionColor;
			arr[right].color = partitionColor;

			left++;
			right--;
		}
	}
	for (let i = start; i <= end; i++) {
		arr[i].color = barColor;
	}
	return left;
};

const quickSort = async (arr, start, end) => {
	if (arr.length > 1) {
		let index = await partition(arr, start, end);
		if (start < index - 1) {
			await quickSort(arr, start, index - 1);
		}
		if (index < end) {
			await quickSort(arr, index, end);
		}
	}
	return arr;
};

/* END QUICK SORT */

/* MERGE SORT */

const mergeSort = async array => {
	if (array.length <= 1) return array;
	const auxiliaryArray = [...array];
	await mergeSortHelper(array, 0, array.length - 1, auxiliaryArray);
	return array;
};

const mergeSortHelper = async (mainArray, startIdx, endIdx, auxiliaryArray) => {
	if (startIdx === endIdx) return;
	const middleIdx = Math.floor((startIdx + endIdx) / 2);
	await mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray);
	await mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray);

	await merge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray);
};

const merge = async (mainArray, startIdx, middleIdx, endIdx, auxiliaryArray) => {
	let k = startIdx;
	let i = startIdx;
	let j = middleIdx + 1;
	while (i <= middleIdx && j <= endIdx) {
		mainArray[k].color = swapColor;

		if (auxiliaryArray[i].value <= auxiliaryArray[j].value) {
			mainArray[k].color = swapColor;

			await sleep(1 + ((500 - barCount) * 1) / 100);

			mainArray[k].color = barColor;

			mainArray[k] = auxiliaryArray[i];

			k++;
			i++;
		} else {
			mainArray[k].color = swapColor;

			await sleep(1 + ((500 - barCount) * 1) / 100);

			mainArray[k].color = barColor;

			mainArray[k] = auxiliaryArray[j];

			k++;
			j++;
		}
	}
	while (i <= middleIdx) {
		mainArray[k].color = swapColor;

		await sleep(1 + ((500 - barCount) * 1) / 100);

		mainArray[k].color = barColor;

		mainArray[k] = auxiliaryArray[i];

		k++;
		i++;
	}
	while (j <= endIdx) {
		mainArray[k].color = swapColor;

		await sleep(1 + ((500 - barCount) * 1) / 100);

		mainArray[k].color = barColor;

		mainArray[k] = auxiliaryArray[j];

		k++;
		j++;
	}
};

/* END MERGE SORT */

/* SELECTION SORT */

const selectionSort = async arr => {
	let minIdx;
	for (let i = 0; i < arr.length - 1; i++) {
		minIdx = i;
		for (let j = i + 1; j < arr.length; j++) {
			arr[j].color = swapColor;
			await sleep(1 + ((500 - barCount) * 1) / 100);
			if (arr[j].value <= arr[minIdx].value) {
				arr[j].color = barColor;
				arr[minIdx].color = barColor;

				minIdx = j;

				arr[minIdx].color = pivotColor;
			} else {
				arr[j].color = barColor;
			}
		}
		arr[minIdx].color = barColor;
		await swap(arr, i, minIdx);
		arr[i].color = partitionColor;
		// arr[minIdx].color = partitionColor;
	}
	arr[arr.length - 1].color = partitionColor;
	return arr;
};

/* END SELECTION SORT */

/* BUBBLE SORT */

const bubbleSort = async arr => {
	let i = arr.length;
	while (i > 1) {
		let swapped = false;
		for (let j = 0; j < i - 1; j++) {
			arr[j].color = swapColor;
			if (arr[j].value > arr[j + 1].value) {
				await swap(arr, j, j + 1);
				swapped = true;
			}
			arr[j].color = barColor;
		}
		if (swapped === false) {
			return arr;
		} else {
			i--;
		}
	}
};

/* END BUBBLE SORT */

window.onload = () => {
	barCountLabel.innerHTML = barCountSlider.value;
	generateArray();
};

barCountSlider.addEventListener('input', e => {
	barCountLabel.innerHTML = e.target.value;
	barCount = e.target.value;
	generateArray();
});

generateBtn.addEventListener('click', () => {
	generateArray();
});

quickSortBtn.addEventListener('click', async () => {
	console.time('quick sort');
	await quickSort(sortArray, 0, sortArray.length - 1);
	console.timeEnd('quick sort');
	sortArray.map((item, index) => {
		setTimeout(() => {
			sortArray[index].color = partitionColor;
		}, 10 * index);
	});
});

mergeSortBtn.addEventListener('click', async () => {
	console.time('merge sort');
	sortArray = await mergeSort(sortArray);
	console.timeEnd('merge sort');
	sortArray.map((item, index) => {
		setTimeout(() => {
			sortArray[index].color = partitionColor;
		}, 10 * index);
	});
});

selectionSortBtn.addEventListener('click', async () => {
	console.time('selection sort');
	sortArray = await selectionSort(sortArray);
	console.timeEnd('selection sort');
});

bubbleSortBtn.addEventListener('click', async () => {
	console.time('bubble sort');
	sortArray = await bubbleSort(sortArray);
	console.timeEnd('bubble sort');
	sortArray.map((item, index) => {
		setTimeout(() => {
			sortArray[index].color = partitionColor;
		}, 10 * index);
	});
});
