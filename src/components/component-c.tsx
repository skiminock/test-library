import React from 'react'

export const ComponentС = () => {
    return (
        <div>
            {[1,2,3,4,5].map(it => {
                return (
                    <span style={{ backgroundColor: 'red' }}>{it} block</span>
                )
            })}
        </div>
    )
}