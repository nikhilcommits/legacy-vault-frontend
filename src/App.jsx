import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useReadContract, useWriteContract } from 'wagmi'
import { injected } from 'wagmi/connectors'
import vaultAbi from './Vault.abi.json'
import { VAULT_ADDRESS } from './wagmi.js'
import './App.css'

const STATE_LABELS = ['Active', 'Pending', 'Claimable']
const STATE_COLORS = {
  Active: '#7A9B76',
  Pending: '#C9A227',
  Claimable: '#7B9EBF',
}
const ZERO = '0x0000000000000000000000000000000000000000'

const BRASS = '#C9A227'
const INK = '#EDE7D9'
const BG = '#14120F'
const LINE = '#332E27'
const MUTED = '#8A8171'

function shorten(addr) {
  if (!addr) return ''
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

function VaultMark({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke={BRASS} strokeWidth="1.5" />
      <circle cx="20" cy="20" r="12" stroke={BRASS} strokeWidth="1" opacity="0.6" />
      <circle cx="20" cy="20" r="3" fill={BRASS} />
      <line x1="20" y1="8" x2="20" y2="12" stroke={BRASS} strokeWidth="1.5" />
      <line x1="20" y1="28" x2="20" y2="32" stroke={BRASS} strokeWidth="1.5" opacity="0.5" />
      <line x1="8" y1="20" x2="12" y2="20" stroke={BRASS} strokeWidth="1.5" opacity="0.5" />
      <line x1="28" y1="20" x2="32" y2="20" stroke={BRASS} strokeWidth="1.5" opacity="0.5" />
    </svg>
  )
}

function StatusBadge({ label }) {
  const color = STATE_COLORS[label] || MUTED
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontFamily: "'Courier New', ui-monospace, monospace",
        fontSize: '0.8rem',
        letterSpacing: '0.03em',
        color,
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {label}
    </span>
  )
}

function Panel({ label, children, style }) {
  return (
    <div style={{ border: `1px solid ${LINE}`, padding: '1.75rem', marginBottom: '1.5rem', position: 'relative', ...style }}>
      {label && (
        <div
          style={{
            position: 'absolute', top: '-0.6rem', left: '1.25rem', background: BG, padding: '0 0.6rem',
            fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '0.75rem', fontStyle: 'italic', color: MUTED,
          }}
        >
          {label}
        </div>
      )}
      {children}
    </div>
  )
}

function Button({ children, onClick, filled = false, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '9px 20px', fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '0.88rem',
        letterSpacing: '0.01em', cursor: 'pointer', border: `1px solid ${BRASS}`,
        background: filled ? BRASS : 'transparent', color: filled ? '#14120F' : BRASS,
        transition: 'background 0.15s, color 0.15s', ...style,
      }}
      onMouseOver={(e) => {
        if (!filled) { e.currentTarget.style.background = BRASS; e.currentTarget.style.color = '#14120F' }
      }}
      onMouseOut={(e) => {
        if (!filled) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = BRASS }
      }}
    >
      {children}
    </button>
  )
}

function Input({ placeholder, value, onChange, style }) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        background: 'transparent', border: 'none', borderBottom: `1px solid ${LINE}`, padding: '8px 4px',
        color: INK, fontFamily: "ui-monospace, 'Courier New', monospace", fontSize: '0.85rem',
        width: '320px', marginRight: '0.75rem', outline: 'none', ...style,
      }}
    />
  )
}

function App() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { writeContract } = useWriteContract()

  const [beneficiaryInput, setBeneficiaryInput] = useState('')
  const [guardianInput, setGuardianInput] = useState('')
  const [depositAmount, setDepositAmount] = useState('0.001')

  const { data: state } = useReadContract({ address: VAULT_ADDRESS, abi: vaultAbi, functionName: 'state' })
  const { data: balance } = useReadContract({ address: VAULT_ADDRESS, abi: vaultAbi, functionName: 'balance' })
  const { data: owner } = useReadContract({ address: VAULT_ADDRESS, abi: vaultAbi, functionName: 'owner' })
  const { data: guardian } = useReadContract({ address: VAULT_ADDRESS, abi: vaultAbi, functionName: 'guardian' })
  const { data: beneficiary } = useReadContract({ address: VAULT_ADDRESS, abi: vaultAbi, functionName: 'beneficiary' })
  const { data: timeoutPeriod } = useReadContract({ address: VAULT_ADDRESS, abi: vaultAbi, functionName: 'timeoutPeriod' })
  const { data: gracePeriod } = useReadContract({ address: VAULT_ADDRESS, abi: vaultAbi, functionName: 'gracePeriod' })

  const call = (functionName, args = [], value) =>
    writeContract({ address: VAULT_ADDRESS, abi: vaultAbi, functionName, args, value })

  const stateLabel = state !== undefined ? STATE_LABELS[state] : null
  const daysFromSeconds = (s) => (s !== undefined ? (Number(s) / 86400).toFixed(0) : '...')

  return (
    <div style={{ minHeight: '100vh', background: BG, color: INK, fontFamily: "Georgia, 'Times New Roman', serif", padding: '3.5rem 1.5rem' }}>
      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '2.75rem', paddingBottom: '1.75rem', borderBottom: `1px solid ${LINE}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <VaultMark />
            <div>
              <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 400, letterSpacing: '0.01em' }}>Legacy Vault</h1>
              <p style={{ margin: '3px 0 0 0', color: MUTED, fontSize: '0.82rem', fontStyle: 'italic' }}>
                Trustless crypto inheritance
              </p>
            </div>
          </div>
          {!isConnected ? (
            <Button filled onClick={() => connect({ connector: injected() })}>Connect</Button>
          ) : (
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: MUTED, fontFamily: 'ui-monospace, monospace' }}>
                {shorten(address)}
              </p>
              <button
                onClick={() => disconnect()}
                style={{
                  background: 'none', border: 'none', color: '#6b6355', fontSize: '0.78rem',
                  cursor: 'pointer', padding: 0, marginTop: '3px', fontStyle: 'italic', fontFamily: 'Georgia, serif',
                }}
              >
                disconnect
              </button>
            </div>
          )}
        </div>

        {!isConnected ? (
          <div
            style={{
              border: `1px solid ${LINE}`,
              padding: '2.5rem',
              textAlign: 'center',
              color: MUTED,
              fontStyle: 'italic',
              fontSize: '0.95rem',
            }}
          >
            Connect your wallet to view the vault
          </div>
        ) : (
          <>
            <Panel label="Vault Status">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
                {stateLabel ? <StatusBadge label={stateLabel} /> : <span style={{ color: MUTED }}>reading...</span>}
                <span style={{ fontSize: '1.6rem', fontWeight: 400 }}>
                  {balance !== undefined ? `${Number(balance) / 1e18} ETH` : '...'}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "ui-monospace, 'Courier New', monospace", fontSize: '0.82rem', color: '#B5AC9A',
                  lineHeight: 2, borderTop: `1px solid ${LINE}`, paddingTop: '1rem',
                }}
              >
                <div>owner &nbsp;&nbsp;&nbsp;&nbsp;{owner ? shorten(owner) : '...'}</div>
                <div>guardian &nbsp;{guardian && guardian !== ZERO ? shorten(guardian) : <span style={{ color: '#6b6355' }}>not set</span>}</div>
                <div>heir &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{beneficiary && beneficiary !== ZERO ? shorten(beneficiary) : <span style={{ color: '#6b6355' }}>not set</span>}</div>
                <div style={{ marginTop: '0.4rem', color: '#6b6355' }}>
                  {daysFromSeconds(timeoutPeriod)}-day timeout, {daysFromSeconds(gracePeriod)}-day grace period
                </div>
              </div>
            </Panel>

            <Panel label="Deposit">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Input value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} style={{ width: '140px' }} />
                <span style={{ color: MUTED, marginRight: '1rem', fontSize: '0.85rem' }}>ETH</span>
                <Button
                  onClick={() => {
                    const wei = BigInt(Math.round(parseFloat(depositAmount || '0') * 1e18))
                    if (wei > 0n) call('deposit', [], wei)
                  }}
                >
                  Deposit
                </Button>
              </div>
            </Panel>

            <Panel label="Proof of Life">
              <Button onClick={() => call('checkIn')}>Check In</Button>
              <span style={{ color: MUTED, fontSize: '0.8rem', marginLeft: '1rem' }}>Resets the inactivity clock</span>
            </Panel>

            <Panel label="Claim">
              <Button onClick={() => call('claim')}>Claim</Button>
              <span style={{ color: MUTED, fontSize: '0.8rem', marginLeft: '1rem' }}>Only available once the vault is Claimable</span>
            </Panel>

            <Panel label="Designate Heir">
              <div style={{ display: 'flex' }}>
                <Input placeholder="0x..." value={beneficiaryInput} onChange={(e) => setBeneficiaryInput(e.target.value)} />
                <Button onClick={() => call('setBeneficiary', [beneficiaryInput])}>Set</Button>
              </div>
            </Panel>

            <Panel label="Designate Guardian">
              <div style={{ display: 'flex' }}>
                <Input placeholder="0x..." value={guardianInput} onChange={(e) => setGuardianInput(e.target.value)} />
                <Button onClick={() => call('setGuardian', [guardianInput])}>Set</Button>
              </div>
            </Panel>
          </>
        )}

        <p style={{ textAlign: 'center', color: '#4a4438', fontSize: '0.78rem', marginTop: '2.5rem', fontStyle: 'italic' }}>
          <a href={`https://sepolia.etherscan.io/address/${VAULT_ADDRESS}`} target="_blank" rel="noreferrer" style={{ color: MUTED }}>
            {shorten(VAULT_ADDRESS)}
          </a>{' '}
          — deployed on Sepolia
        </p>
      </div>
    </div>
  )
}

export default App