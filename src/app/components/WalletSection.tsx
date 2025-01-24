'use client'

import { WalletButton } from '@vechain/dapp-kit-react'
import styles from './WalletSection.module.css'

export function WalletSection() {
  return (
    <div style={{ 
      "--vdk-color-light-primary": "#fdc603",
      "--vdk-font-weight-medium": "700"
    } as React.CSSProperties}>
      <WalletButton />
    </div>
  )
} 