import { useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { formatEther, parseEther } from "viem";

import vaultAbi from "./Vault.abi.json";
import { VAULT_ADDRESS } from "./wagmi.js";
import "./App.css";

const ZERO =
  "0x0000000000000000000000000000000000000000";

const STATES = ["Active", "Pending", "Claimable"];

function shortAddress(address) {
  if (!address) return "-";
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}

function getState(state) {
  if (state === undefined || state === null) {
    return "Loading";
  }

  return STATES[Number(state)] || "Unknown";
}

function formatBalance(value) {
  if (value === undefined || value === null) {
    return "0.0000";
  }

  try {
    return Number(formatEther(value)).toFixed(4);
  } catch {
    return "0.0000";
  }
}

function formatDays(value) {
  if (value === undefined || value === null) {
    return "-";
  }

  try {
    return Math.round(Number(value) / 86400);
  } catch {
    return "-";
  }
}

function Address({ value }) {
  if (!value || value === ZERO) {
    return (
      <span className="not-configured">
        Not configured
      </span>
    );
  }

  return (
    <span className="address-text">
      {shortAddress(value)}
    </span>
  );
}

function App() {
  const { address, isConnected } = useAccount();

  const { connect } = useConnect();

  const { disconnect } = useDisconnect();

  const { writeContract } = useWriteContract();

  const [depositAmount, setDepositAmount] =
    useState("0.001");

  const [beneficiaryInput, setBeneficiaryInput] =
    useState("");

  const [guardianInput, setGuardianInput] =
    useState("");

  const [loading, setLoading] = useState("");

  // =====================================================
  // CONTRACT READS
  // =====================================================

  const { data: state } = useReadContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: "state",
  });

  const { data: balance } = useReadContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: "balance",
  });

  const { data: owner } = useReadContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: "owner",
  });

  const { data: guardian } = useReadContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: "guardian",
  });

  const { data: beneficiary } = useReadContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: "beneficiary",
  });

  const { data: timeoutPeriod } = useReadContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: "timeoutPeriod",
  });

  const { data: gracePeriod } = useReadContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: "gracePeriod",
  });

  // =====================================================
  // CONTRACT WRITE
  // =====================================================

  function execute(functionName, args = [], value) {
    try {
      setLoading(functionName);

      const config = {
        address: VAULT_ADDRESS,
        abi: vaultAbi,
        functionName,
        args,
      };

      if (value !== undefined) {
        config.value = value;
      }

      writeContract(config);

      setTimeout(() => {
        setLoading("");
      }, 1500);
    } catch (error) {
      console.error(error);
      setLoading("");
    }
  }

  // =====================================================
  // DEPOSIT
  // =====================================================

  function handleDeposit() {
    try {
      if (
        !depositAmount ||
        Number(depositAmount) <= 0
      ) {
        alert("Enter a valid ETH amount.");
        return;
      }

      const amount = parseEther(depositAmount);

      execute("deposit", [], amount);
    } catch (error) {
      console.error(error);
      alert("Invalid ETH amount.");
    }
  }

  // =====================================================
  // BENEFICIARY
  // =====================================================

  function handleBeneficiary() {
    if (!beneficiaryInput) {
      alert("Enter a beneficiary address.");
      return;
    }

    execute("setBeneficiary", [
      beneficiaryInput,
    ]);
  }

  // =====================================================
  // GUARDIAN
  // =====================================================

  function handleGuardian() {
    if (!guardianInput) {
      alert("Enter a guardian address.");
      return;
    }

    execute("setGuardian", [
      guardianInput,
    ]);
  }

  // =====================================================
  // CONNECT SCREEN
  // =====================================================

  if (!isConnected) {
    return (
      <div className="page">
        <div className="top-bar">
          <div className="logo">
            LEGACY VAULT
          </div>

          <div className="network">
            SEPOLIA
          </div>
        </div>

        <div className="connect-container">
          <div className="connect-box">
            <div className="small-label">
              BLOCKCHAIN INHERITANCE SYSTEM
            </div>

            <h1 className="connect-title">
              Legacy Vault
            </h1>

            <p className="connect-text">
              A non-custodial Ethereum vault for
              digital inheritance.
            </p>

            <button
              onClick={() =>
                connect({
                  connector: injected(),
                })
              }
              className="primary-button"
            >
              CONNECT WALLET
            </button>

            <div className="connect-network">
              Network: Ethereum Sepolia
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentState = getState(state);

  const stateColor =
    currentState === "Active"
      ? "#71C96B"
      : currentState === "Pending"
      ? "#D6A84F"
      : currentState === "Claimable"
      ? "#5DA9DD"
      : "#999";

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="page">

      {/* HEADER */}

      <header className="top-bar">
        <div className="header-left">
          <div className="logo">
            LEGACY VAULT
          </div>

          <div className="divider">
            /
          </div>

          <div className="header-sub">
            INHERITANCE PROTOCOL
          </div>
        </div>

        <div className="header-right">
          <span className="network">
            SEPOLIA
          </span>

          <span className="header-address">
            {shortAddress(address)}
          </span>

          <button
            onClick={() => disconnect()}
            className="disconnect"
          >
            DISCONNECT
          </button>
        </div>
      </header>

      {/* MAIN */}

      <main className="container">

        {/* PAGE HEADING */}

        <div className="page-heading">
          <div>
            <div className="section-number">
              01 / VAULT
            </div>

            <h1 className="title">
              Legacy Vault
            </h1>

            <p className="subtitle">
              Autonomous inheritance protocol
            </p>
          </div>

          <a
            href={`https://sepolia.etherscan.io/address/${VAULT_ADDRESS}`}
            target="_blank"
            rel="noreferrer"
            className="contract-link"
          >
            VIEW CONTRACT ↗
          </a>
        </div>

        {/* MAIN GRID */}

        <div className="main-grid">

          {/* LEFT COLUMN */}

          <section>

            {/* BALANCE */}

            <div className="balance-box">

              <div className="balance-header">
                <span>
                  VAULT BALANCE
                </span>

                <span
                  className="state-indicator"
                  style={{
                    color: stateColor,
                  }}
                >
                  ● {currentState.toUpperCase()}
                </span>
              </div>

              <div className="balance-value">
                {formatBalance(balance)}

                <span className="balance-unit">
                  ETH
                </span>
              </div>

              <div className="balance-footer">
                <span>
                  CONTRACT
                </span>

                <span className="mono">
                  {shortAddress(
                    VAULT_ADDRESS
                  )}
                </span>
              </div>

            </div>

            {/* PARAMETERS */}

            <div className="block">

              <div className="block-title">
                VAULT PARAMETERS
              </div>

              <div className="parameter-grid">

                <div className="parameter">
                  <span className="param-label">
                    TIMEOUT PERIOD
                  </span>

                  <strong>
                    {formatDays(
                      timeoutPeriod
                    )}{" "}
                    DAYS
                  </strong>
                </div>

                <div className="parameter">
                  <span className="param-label">
                    GRACE PERIOD
                  </span>

                  <strong>
                    {formatDays(
                      gracePeriod
                    )}{" "}
                    DAYS
                  </strong>
                </div>

              </div>

            </div>

            {/* PARTICIPANTS */}

            <div className="block">

              <div className="block-title">
                VAULT PARTICIPANTS
              </div>

              <div className="person-row">
                <span className="person-role">
                  OWNER
                </span>

                <Address value={owner} />
              </div>

              <div className="person-row">
                <span className="person-role">
                  BENEFICIARY
                </span>

                <Address value={beneficiary} />
              </div>

              <div className="person-row">
                <span className="person-role">
                  GUARDIAN
                </span>

                <Address value={guardian} />
              </div>

            </div>

            {/* INHERITANCE STATUS */}

            <div className="block">

              <div className="block-title">
                INHERITANCE STATUS
              </div>

              <div className="inheritance-content">

                <div className="inheritance-info">

                  <div
                    className="inheritance-state"
                    style={{
                      color: stateColor,
                    }}
                  >
                    {currentState.toUpperCase()}
                  </div>

                  <div className="inheritance-description">
                    Claim becomes available when
                    the vault reaches claimable
                    state.
                  </div>

                </div>

                <button
                  disabled={
                    currentState !==
                      "Claimable" ||
                    loading === "claim"
                  }
                  onClick={() =>
                    execute("claim")
                  }
                  className="secondary-button claim-button"
                  style={{
                    opacity:
                      currentState ===
                      "Claimable"
                        ? 1
                        : 0.4,
                    cursor:
                      currentState ===
                      "Claimable"
                        ? "pointer"
                        : "not-allowed",
                  }}
                >
                  {loading === "claim"
                    ? "PROCESSING"
                    : "CLAIM"}
                </button>

              </div>

            </div>

          </section>

          {/* RIGHT COLUMN */}

          <aside>

            {/* CHECK IN */}

            <div className="action-box">

              <div className="action-number">
                ACTION 01
              </div>

              <h2 className="action-title">
                Check In
              </h2>

              <p className="action-text">
                Confirm continued activity and
                reset the vault inactivity timer.
              </p>

              <button
                disabled={
                  loading === "checkIn"
                }
                onClick={() =>
                  execute("checkIn")
                }
                className="primary-button"
              >
                {loading === "checkIn"
                  ? "PROCESSING..."
                  : "CHECK IN"}
              </button>

            </div>

            {/* DEPOSIT */}

            <div className="action-box">

              <div className="action-number">
                ACTION 02
              </div>

              <h2 className="action-title">
                Deposit
              </h2>

              <p className="action-text">
                Add ETH directly to your
                inheritance vault.
              </p>

              <div className="input-group">

                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={depositAmount}
                  onChange={(e) =>
                    setDepositAmount(
                      e.target.value
                    )
                  }
                  className="input"
                  placeholder="0.001"
                />

                <span className="input-unit">
                  ETH
                </span>

              </div>

              <button
                disabled={
                  loading === "deposit"
                }
                onClick={handleDeposit}
                className="primary-button"
              >
                {loading === "deposit"
                  ? "PROCESSING..."
                  : "DEPOSIT FUNDS"}
              </button>

            </div>

            {/* BENEFICIARY */}

            <div className="action-box">

              <div className="action-number">
                ACTION 03
              </div>

              <h2 className="action-title">
                Beneficiary
              </h2>

              <p className="action-text">
                Set the wallet address that
                receives the vault after
                inheritance becomes claimable.
              </p>

              <input
                value={beneficiaryInput}
                onChange={(e) =>
                  setBeneficiaryInput(
                    e.target.value
                  )
                }
                className="full-input"
                placeholder="0x..."
              />

              <button
                disabled={
                  loading ===
                  "setBeneficiary"
                }
                onClick={
                  handleBeneficiary
                }
                className="secondary-button"
              >
                {loading ===
                "setBeneficiary"
                  ? "PROCESSING..."
                  : "SET BENEFICIARY"}
              </button>

            </div>

            {/* GUARDIAN */}

            <div className="action-box">

              <div className="action-number">
                ACTION 04
              </div>

              <h2 className="action-title">
                Guardian
              </h2>

              <p className="action-text">
                Configure the wallet assigned
                to the guardian role.
              </p>

              <input
                value={guardianInput}
                onChange={(e) =>
                  setGuardianInput(
                    e.target.value
                  )
                }
                className="full-input"
                placeholder="0x..."
              />

              <button
                disabled={
                  loading === "setGuardian"
                }
                onClick={handleGuardian}
                className="secondary-button"
              >
                {loading === "setGuardian"
                  ? "PROCESSING..."
                  : "SET GUARDIAN"}
              </button>

            </div>

          </aside>

        </div>

        {/* SYSTEM STATUS */}

        <div className="activity">

          <div className="block-title">
            SYSTEM STATUS
          </div>

          <div className="status-line">

            <span className="green-dot">
              ●
            </span>

            <span>
              Contract connection active
            </span>

            <span className="status-right">
              SEPOLIA
            </span>

          </div>

          <div className="status-line">

            <span
              style={{
                color: stateColor,
              }}
            >
              ●
            </span>

            <span>
              Vault state: {currentState}
            </span>

            <span className="status-right">
              {formatBalance(balance)} ETH
            </span>

          </div>

          <div className="status-line">

            <span className="status-grey">
              ●
            </span>

            <span>
              Contract address
            </span>

            <a
              href={`https://sepolia.etherscan.io/address/${VAULT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="etherscan"
            >
              {shortAddress(
                VAULT_ADDRESS
              )}{" "}
              ↗
            </a>

          </div>

        </div>

        {/* FOOTER */}

        <footer className="footer">

          <span>
            LEGACY VAULT / ETHEREUM SEPOLIA
          </span>

          <span>
            NON-CUSTODIAL INHERITANCE PROTOCOL
          </span>

        </footer>

      </main>
    </div>
  );
}

export default App;