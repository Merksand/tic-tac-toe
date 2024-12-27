import "./index.css";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

function App() {
    const board = Array(9).fill(null);

    const [tablero, setTablero] = useState(() => {
        const localTablero = JSON.parse(localStorage.getItem("Tablero"));
        const res = localTablero ? localTablero : board;
        return res;
    });
    const [jugador, setJugador] = useState(() => {
        const localJugador = localStorage.getItem("Jugador");
        return localJugador ? localJugador : "X";
    });
    const [ganador, setGanador] = useState(() => {
        const localGanador = localStorage.getItem("Ganador");
        if (localGanador === "X" || localGanador === "O" || localGanador === "Empate") {
            return localGanador;
        }
        return false;
    });

    useEffect(() => {
        localStorage.setItem("Tablero", JSON.stringify(tablero));
        localStorage.setItem("Jugador", jugador);
        localStorage.setItem("Ganador", ganador);
    }, [jugador, tablero, ganador]);
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6],
    ];
    function handleClick(indexBoard) {
        if (tablero[indexBoard] === null && !ganador) {
            const newTablero = tablero.map((item, index) => {
                return index === indexBoard ? jugador : item;
            });

            for (let item of winningCombinations) {
                const [a, b, c] = item;
                if (
                    newTablero[a] === jugador &&
                    newTablero[b] === jugador &&
                    newTablero[c] === jugador
                ) {
                    setGanador(jugador);

                    confetti({
                        spread: 100,
                        particleCount: 200,
                    });
                    setTablero(newTablero);
                    return;
                }
            }

            const empate = newTablero.every((item) => item !== null);
            if (empate) setGanador("Empate");
            setJugador(jugador === "X" ? "O" : "X");
            setTablero(newTablero);
        }
    }

    function reinicio() {
        setTablero(board);
        setJugador("X");
        setGanador(false);
    }
    return (
        <main>
            <div className="text-center h-screen flex flex-col justify-center bg-slate-400">
                <h1 className="text-5xl font-bold ">Tic Tac Toe</h1>
                <h1 className="text-2xl mt-4 h-10">
                    {ganador && (
                        <span className="font-bold text-red-500">
                            {ganador === "Empate"
                                ? `Empataron`
                                : `Ganó ${ganador}`}
                        </span>
                    )}
                </h1>
                <section className="grid grid-cols-3  mx-auto gap-2 mt-5 select-none">
                    {tablero.map((cell, index) => {
                        return (
                            <div
                                onClick={() => handleClick(index)}
                                key={index}
                                className={` ${
                                    cell == "X"
                                        ? "bg-green-500"
                                        : cell == "O"
                                        ? "bg-blue-500"
                                        : "bg-white"
                                } w-20 h-20 flex justify-center items-center font-bold text-2xl rounded `}
                            >
                                <span className="font-bold">{cell}</span>
                            </div>
                        );
                    })}
                </section>

                <section className="flex gap-2 justify-center mt-4 text-5xl">
                    <span
                        className={`${
                            jugador == "X" ? "bg-blue-400 " : ""
                        } w-16 p-2  rounded-lg`}
                    >
                        X
                    </span>
                    <span
                        className={`${
                            jugador == "O" ? "bg-blue-400 " : ""
                        } w-16 p-2  rounded-lg`}
                    >
                        O
                    </span>
                </section>
                <button
                    onClick={reinicio}
                    className=" mx-auto p-4 mt-4 bg-slate-500 active:bg-slate-600 text-white py-2 px-4 rounded"
                >
                    Reiniciar Juego
                </button>
            </div>
        </main>
    );
}

export default App;
