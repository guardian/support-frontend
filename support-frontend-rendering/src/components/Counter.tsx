import React, { useState } from 'react';

function Counter(): React.ReactElement {
    const [count, setCount] = useState<number>(0);

    function incrementCounter(): void {
        setCount((currentCount: number) => currentCount + 1);
    }

    return (
        <div>
            <h1>Counter at: {count}</h1>
            <button onClick={incrementCounter}>Increment</button>
        </div>
    );
}

export default Counter;
