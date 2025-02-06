const domCells = Array.from(grid.querySelectorAll('.cell'));
const cells = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0]);

let currentPlayer = 1;
const history = [];

function record (target) {
	history.push([[...cells], target]);
	console.log(history);
}

function resetGrid () {
	cells.forEach((_, index) => {
		domCells[index].classList.remove('x');
		domCells[index].classList.remove('o');
		cells[index] = 0;
	});

	// currentPlayer = 1;
}

grid.addEventListener('click', (event) => {
	const targetIndex = domCells.findIndex(cell => cell == event.target);

	if (targetIndex == -1 || cells[targetIndex] != 0) return;

	domCells[targetIndex].classList.add(currentPlayer == 1 ? 'x' : 'o');

	if (currentPlayer == 2) record(targetIndex);

	cells[targetIndex] = currentPlayer;
	currentPlayer = currentPlayer == 1 ? 2 : 1;

	if (cells.findIndex(cell => cell == 0) == -1) resetGrid();
});

reset.addEventListener('click', resetGrid);

async function loadData () {
	try {
		const response = await fetch('js/data.json');

		if (!response.ok) throw new Error('Failed to fetch!');

		const data = await response.json();

		console.log(data);
	} catch (error) {
		console.error(error);
	}
}

loadData();
