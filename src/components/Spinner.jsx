import React from 'react'

const Spinner = () => {
return (
    <div
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80px',
        }}
    >
        <span
            style={{
                width: 40,
                height: 40,
                border: '4px solid',
                borderColor:
                    'var(--spinner-border, #ccc) transparent var(--spinner-border, #ccc) transparent',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'spin 1s linear infinite',
            }}
        />
        <style>
            {`
                @keyframes spin {
                    0% { transform: rotate(0deg);}
                    100% { transform: rotate(360deg);}
                }
                @media (prefers-color-scheme: dark) {
                    :root {
                        --spinner-border: #888;
                    }
                }
                @media (prefers-color-scheme: light) {
                    :root {
                        --spinner-border: #333;
                    }
                }
            `}
        </style>
    </div>
)
}

export default Spinner
