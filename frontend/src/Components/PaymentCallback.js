import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Button,
  Divider,
} from "@mui/material";
import axios from "axios";
import { jsPDF } from "jspdf";

const BASE_URL = process.env.REACT_APP_API_URL;

// Updated Color Palette
const theme = {
  primary: "#ffffff", // Background color
  secondary: "rgba(255, 255, 255, 0.8)", // Semi-transparent white for loading
  accent: "#201548", // Button colors, highlighted text, links
  textPrimary: "#0e0f0f", // Primary text color
  textSecondary: "#4d4d4d", // Secondary text color (slightly lighter for contrast)
  error: "#EF5350", // Soft Red for errors
  success: "#4CAF50", // Green for success
  transparent: "rgba(255, 255, 255, 0.2)", // Semi-transparent white for Receipt
};

const PaymentCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const orderId = query.get("order_id");
  const [paymentStatus, setPaymentStatus] = useState(location.state || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [terms, setTerms] = useState([]);
  const maxRetries = 5;
  const retryDelay = 3000;

  const verifyPayment = async (orderId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/razorpay/verify?order_id=${orderId}`
      );
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  // Fetch terms and conditions
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/terms/terms");
        // Remove duplicates based on the 'term' property
        const uniqueTerms = Array.from(
          new Set(response.data.map((item) => item.term))
        ).map((term) =>
          response.data.find((item) => item.term === term)
        );
        setTerms(uniqueTerms);
      } catch (error) {
        setError("Failed to fetch terms and conditions.");
        setTerms([]);
      }
    };
    fetchTerms();
  }, []);

  useEffect(() => {
    const attemptVerification = async () => {
      if (!orderId) {
        setError("No order ID provided. Please try initiating the payment again.");
        setLoading(false);
        return;
      }

      try {
        const statusData = await verifyPayment(orderId);

        if (statusData.paymentStatus === "PENDING" && retryCount < maxRetries) {
          setTimeout(() => {
            setRetryCount(retryCount + 1);
          }, retryDelay);
          return;
        }

        setPaymentStatus(statusData);
        setLoading(false);
        if (statusData.paymentStatus === "FAILED") {
          setError(`Payment failed: ${statusData.failureReason || "Unknown reason"}`);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message;
        setError(`Failed to verify payment: ${errorMessage}`);
        setLoading(false);
      }
    };

    if (!paymentStatus || paymentStatus.paymentStatus === "PENDING") {
      attemptVerification();
    } else {
      setLoading(false);
      if (paymentStatus.paymentStatus === "FAILED") {
        setError(`Payment failed: ${paymentStatus.failureReason || "Unknown reason"}`);
      }
    }
  }, [orderId, retryCount, paymentStatus]);

  const handleTryAgain = () => {
    navigate("/pay", { state: location.state });
  };

  const handleRefreshStatus = async () => {
    setLoading(true);
    setError("");
    setRetryCount(0);
    try {
      const statusData = await verifyPayment(orderId);
      setPaymentStatus(statusData);
      setLoading(false);
      if (statusData.paymentStatus === "FAILED") {
        setError(`Payment failed: ${statusData.failureReason || "Unknown reason"}`);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(`Failed to refresh payment status: ${errorMessage}`);
      setLoading(false);
    }
  };

  const generateReceiptPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    const lineSpacing = 8;
    let yPosition = margin;

    const drawRoundedRect = (x, y, width, height, radius) => {
      doc.setFillColor(204, 204, 204);
      doc.roundedRect(x + 1, y + 1, width, height, radius, radius, "F");
      doc.setFillColor(230, 240, 250);
      doc.roundedRect(x, y, width, height, radius, radius, "F");
    };

    const drawTableRow = (y, cols, isHeader = false) => {
      const colWidths = [80, 30, 30, 30];
      let x = margin + 5;
      doc.setLineWidth(0.2);
      doc.setDrawColor(108, 117, 125);

      if (isHeader) {
        doc.setFillColor(232, 236, 239);
        doc.rect(margin + 5, y - 5, pageWidth - 2 * (margin + 5), 8, "F");
      }

      cols.forEach((col, i) => {
        const text = String(col);
        doc.text(text, x + 2, y, { maxWidth: colWidths[i] - 4 });
        doc.rect(x, y - 5, colWidths[i], 8);
        x += colWidths[i];
      });
    };

    // Header
    doc.setFillColor(42, 64, 102);
    doc.rect(0, 0, pageWidth, 30, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text("Payment Receipt", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
    doc.setFontSize(14);
    doc.text(paymentStatus?.parlor.name || "N/A", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 8;
    doc.setFontSize(10);
    doc.text(`Bill No: ${paymentStatus?.orderId || "N/A"}`, margin, yPosition);
    doc.text(
      `Date: ${
        paymentStatus?.createdAt
          ? new Date(paymentStatus.createdAt).toLocaleDateString()
          : "N/A"
      }`,
      pageWidth - margin - 50,
      yPosition
    );
    yPosition += 10;

    // Customer Details
    drawRoundedRect(margin, yPosition, pageWidth - 2 * margin, 50, 5);
    yPosition += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(26, 26, 26);

    const customerDetails = [
      { label: "Customer", value: paymentStatus?.name || "N/A" },
      {
        label: "Date",
        value: paymentStatus?.date
          ? new Date(paymentStatus.date).toLocaleDateString()
          : "N/A",
      },
      { label: "Time", value: paymentStatus?.time || "N/A" },
      { label: "Employee", value: paymentStatus?.favoriteEmployee || "N/A" },
    ];

    customerDetails.forEach((item) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 128, 128);
      doc.text(`${item.label}:`, margin + 5, yPosition);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(26, 26, 26);
      doc.text(item.value, margin + 45, yPosition);
      yPosition += lineSpacing;
    });

    yPosition += 10;

    // Service Details
    drawRoundedRect(margin, yPosition, pageWidth - 2 * margin, 60, 5);
    yPosition += 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 128, 128);
    doc.text("Service Details", margin + 5, yPosition);
    yPosition += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    drawTableRow(yPosition, ["Description", "Quantity", "Rate", "Total"], true);
    yPosition += 8;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(26, 26, 26);

    const primaryService = [
      paymentStatus?.service || "N/A",
      "1",
      String(paymentStatus?.total_amount || "0"),
      String(paymentStatus?.total_amount || "0"),
    ];
    drawTableRow(yPosition, primaryService);
    yPosition += 8;

    if (paymentStatus?.relatedServices?.length > 0) {
      paymentStatus.relatedServices.forEach((service) => {
        drawTableRow(yPosition, [service, "1", "N/A", "N/A"]);
        yPosition += 8;
      });
    }

    doc.setFont("helvetica", "bold");
    doc.text(
      `Total: ${paymentStatus?.currency || "INR"} ${
        paymentStatus?.total_amount || "N/A"
      }`,
      pageWidth - margin - 50,
      yPosition
    );
    yPosition += 10;

    // Payment Summary
    drawRoundedRect(margin, yPosition, pageWidth - 2 * margin, 70, 5);
    yPosition += 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 128, 128);
    doc.text("Payment Summary", margin + 5, yPosition);
    yPosition += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(26, 26, 26);

    const paymentDetails = [
      {
        label: "Amount Paid",
        value: `${paymentStatus?.currency || "INR"} ${
          paymentStatus?.amount || "N/A"
        }`,
      },
      { label: "Payment Method", value: paymentStatus?.Payment_Mode || "N/A" },
      { label: "Transaction ID", value: paymentStatus?.transactionId || "N/A" },
      { label: "Status", value: paymentStatus?.paymentStatus || "N/A" },
      {
        label: "Date & Time",
        value: paymentStatus?.createdAt
          ? new Date(paymentStatus.createdAt).toLocaleString()
          : "N/A",
      },
    ];

    if (paymentStatus?.paymentStatus === "FAILED") {
      paymentDetails.push({
        label: "Reason",
        value: paymentStatus?.failureReason || "Unknown",
      });
    }

    paymentDetails.forEach((item) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 128, 128);
      doc.text(`${item.label}:`, margin + 5, yPosition);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(26, 26, 26);
      if (item.label === "Status") {
        if (item.value === "SUCCESS") doc.setTextColor(0, 128, 0);
        else if (item.value === "FAILED") doc.setTextColor(255, 0, 0);
      }
      doc.text(item.value, margin + 45, yPosition);
      doc.setTextColor(26, 26, 26);
      yPosition += lineSpacing;
    });

    yPosition += 10;

    // Terms and Conditions
    drawRoundedRect(margin, yPosition, pageWidth - 2 * margin, 60, 5);
    yPosition += 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 128, 128);
    doc.text("Terms & Conditions", margin + 5, yPosition);
    yPosition += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(26, 26, 26);

    if (terms.length > 0) {
      terms.forEach((term, index) => {
        const formattedTerm = `${index + 1}. ${term.term}`;
        const wrappedText = doc.splitTextToSize(formattedTerm, pageWidth - 2 * (margin + 10));
        wrappedText.forEach((line) => {
          doc.text(line, margin + 5, yPosition);
          yPosition += lineSpacing - 2;
        });
        yPosition += 2;
      });
    } else {
      doc.text("No terms and conditions available.", margin + 5, yPosition);
      yPosition += lineSpacing;
    }

    yPosition += 10;

    // Footer
    doc.setFillColor(224, 247, 250);
    doc.rect(0, yPosition, pageWidth, 25, "F");
    doc.setFillColor(200, 240, 245, 0.5);
    doc.rect(0, yPosition + 12.5, pageWidth, 12.5, "F");

    doc.setFillColor(26, 26, 26);
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (Math.random() > 0.5) {
          doc.rect(
            pageWidth - margin - 15 + i * 1.5,
            yPosition + 5 + j * 1.5,
            1,
            1,
            "F"
          );
        }
      }
    }

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(26, 26, 26);
    doc.text(
      `Thank you for choosing ${paymentStatus?.parlor.name || "us"}!`,
      margin + 5,
      yPosition + 10
    );
    doc.setFont("helvetica", "normal");
    doc.text(
      "Contact: support@parlor.com | +123-456-7890",
      margin + 5,
      yPosition + 15
    );

    doc.save(`receipt_${paymentStatus?.orderId || "unknown"}.pdf`);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: { xs: "100%", sm: 600 },
        width: "100%",
        mx: "auto",
        bgcolor: theme.primary,
        borderRadius: { xs: 0, sm: 3 },
        boxShadow: { xs: "none", sm: "0 4px 12px rgba(0,0,0,0.1)" },
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 2, sm: 3 },
          color: theme.textPrimary,
          fontWeight: 700,
          textAlign: "center",
          fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.2rem" },
        }}
      >
        Payment Status
      </Typography>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
            bgcolor: theme.secondary,
            borderRadius: 2,
            p: { xs: 2, sm: 3 },
          }}
        >
          <CircularProgress sx={{ color: theme.accent }} />
          <Typography
            sx={{
              mt: 2,
              color: theme.textSecondary,
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            Checking payment status, please wait...
          </Typography>
        </Box>
      ) : error ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexGrow: 1,
            px: { xs: 1, sm: 0 },
          }}
        >
          <Alert
            severity="error"
            sx={{
              mb: 3,
              width: "100%",
              bgcolor: "#FFEBEE",
              color: theme.error,
              borderRadius: 2,
              fontSize: { xs: "0.85rem", sm: "0.9rem" },
              "& .MuiAlert-icon": { color: theme.error },
            }}
          >
            {error}
          </Alert>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleTryAgain}
              sx={{
                bgcolor: theme.accent,
                color: "#fff",
                borderRadius: 2,
                px: { xs: 2, sm: 3 },
                py: 1,
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                fontWeight: 500,
                "&:hover": { bgcolor: "#00897B" },
              }}
            >
              Try Again
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              sx={{
                borderColor: theme.accent,
                color: theme.accent,
                borderRadius: 2,
                px: { xs: 2, sm: 3 },
                py: 1,
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                fontWeight: 500,
                "&:hover": { bgcolor: theme.primary, borderColor: theme.accent },
              }}
            >
              Back to Home
            </Button>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          <Alert
            severity={
              paymentStatus?.paymentStatus === "PAID"
                ? "success"
                : paymentStatus?.paymentStatus === "FAILED"
                ? "error"
                : "warning"
            }
            sx={{
              borderRadius: 2,
              bgcolor:
                paymentStatus?.paymentStatus === "PAID"
                  ? "#E8F5E9"
                  : paymentStatus?.paymentStatus === "FAILED"
                  ? "#FFEBEE"
                  : "#FFF8E1",
              color:
                paymentStatus?.paymentStatus === "PAID"
                  ? theme.success
                  : paymentStatus?.paymentStatus === "FAILED"
                  ? theme.error
                  : "#FFCA28",
              fontSize: { xs: "0.85rem", sm: "0.9rem" },
              "& .MuiAlert-icon": {
                color:
                  paymentStatus?.paymentStatus === "PAID"
                    ? theme.success
                    : paymentStatus?.paymentStatus === "FAILED"
                    ? theme.error
                    : "#FFCA28",
              },
            }}
          >
            {paymentStatus?.paymentStatus === "PAID"
              ? `Payment Successful`
              : paymentStatus?.paymentStatus === "FAILED"
              ? `Payment Failed for order: ${orderId}: ${
                  paymentStatus.failureReason || "Unknown reason"
                }`
              : `Payment is still processing for order: ${orderId}. Please wait or refresh the status.`}
          </Alert>
          {paymentStatus && (
            <Box
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                bgcolor: theme.transparent,
                backdropFilter: "blur(5px)", // Adds a frosted glass effect
                border: `1px solid rgba(255, 255, 255, 0.3)`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: theme.textPrimary,
                  fontWeight: 600,
                  fontSize: { xs: "1.2rem", sm: "1.4rem" },
                }}
              >
                Receipt
              </Typography>
              <Divider sx={{ my: 2, bgcolor: "rgba(255, 255, 255, 0.5)" }} />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1fr 1fr",
                  },
                  gap: { xs: 1, sm: 2 },
                  fontSize: { xs: "0.85rem", sm: "0.9rem" },
                }}
              >
                <Typography sx={{ color: theme.textSecondary }}>
                  <strong>Parlor:</strong> {paymentStatus.parlor.name || "N/A"}
                </Typography>
                <Typography sx={{ color: theme.textSecondary }}>
                  <strong>Customer:</strong> {paymentStatus.name || "N/A"}
                </Typography>
                <Typography sx={{ color: theme.textSecondary }}>
                  <strong>Service:</strong> {paymentStatus.service || "N/A"}
                </Typography>
                {paymentStatus.relatedServices?.length > 0 && (
                  <Typography sx={{ color: theme.textSecondary }}>
                    <strong>Additional Services:</strong>{" "}
                    {paymentStatus.relatedServices.join(", ")}
                  </Typography>
                )}
                <Typography sx={{ color: theme.textSecondary }}>
                  <strong>Date:</strong>{" "}
                  {paymentStatus.date
                    ? new Date(paymentStatus.date).toLocaleDateString()
                    : "N/A"}
                </Typography>
                <Typography sx={{ color: theme.textSecondary }}>
                  <strong>Time:</strong> {paymentStatus.time || "N/A"}
                </Typography>
                <Typography sx={{ color: theme.textSecondary }}>
                  <strong>Employee:</strong>{" "}
                  {paymentStatus.favoriteEmployee || "N/A"}
                </Typography>
                <Typography sx={{ color: theme.textSecondary }}>
                  <strong>Total Amount:</strong>{" "}
                  {paymentStatus.currency || "INR"}{" "}
                  {paymentStatus.total_amount || "N/A"}
                </Typography>
                <Typography sx={{ color: theme.textSecondary }}>
                  <strong>Amount Paid:</strong>{" "}
                  {paymentStatus.currency || "INR"}{" "}
                  {paymentStatus.amount || "N/A"}
                </Typography>
                <Typography sx={{ color: theme.textSecondary }}>
                  <strong>Payment Method:</strong>{" "}
                  {paymentStatus.Payment_Mode || "N/A"}
                </Typography>
                <Typography sx={{ color: theme.textSecondary }}>
                  <strong>Transaction ID:</strong>{" "}
                  {paymentStatus.transactionId || "N/A"}
                </Typography>
                <Typography sx={{ color: theme.textSecondary }}>
                  <strong>Order ID:</strong> {paymentStatus.orderId || "N/A"}
                </Typography>
                <Typography sx={{ color: theme.textSecondary }}>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      color:
                        paymentStatus.paymentStatus === "PAID"
                          ? theme.success
                          : paymentStatus.paymentStatus === "FAILED"
                          ? theme.error
                          : "#FFCA28",
                    }}
                  >
                    {paymentStatus.paymentStatus || "N/A"}
                  </span>
                </Typography>
                <Typography sx={{ color: theme.textSecondary }}>
                  <strong>Created At:</strong>{" "}
                  {paymentStatus.createdAt
                    ? new Date(paymentStatus.createdAt).toLocaleString()
                    : "N/A"}
                </Typography>
                {paymentStatus.paymentStatus === "FAILED" && (
                  <Typography sx={{ color: theme.error }}>
                    <strong>Reason:</strong>{" "}
                    {paymentStatus.failureReason || "Unknown"}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: { xs: 1, sm: 2 },
              justifyContent: "center",
              mt: { xs: 1, sm: 2 },
            }}
          >
            {paymentStatus?.paymentStatus === "PAID" && (
              <Button
                variant="contained"
                onClick={generateReceiptPDF}
                sx={{
                  bgcolor: theme.accent,
                  color: "#fff",
                  borderRadius: 2,
                  px: { xs: 2, sm: 3 },
                  py: 1,
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  fontWeight: 500,
                  "&:hover": { bgcolor: "#00897B" },
                }}
              >
                Download Receipt
              </Button>
            )}
            {paymentStatus?.paymentStatus === "PENDING" && (
              <Button
                variant="contained"
                onClick={handleRefreshStatus}
                sx={{
                  bgcolor: theme.accent,
                  color: "#fff",
                  borderRadius: 2,
                  px: { xs: 2, sm: 3 },
                  py: 1,
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  fontWeight: 500,
                  "&:hover": { bgcolor: "#00897B" },
                }}
              >
                Refresh Status
              </Button>
            )}
            {paymentStatus?.paymentStatus === "FAILED" && (
              <Button
                variant="contained"
                onClick={handleTryAgain}
                sx={{
                  bgcolor: theme.accent,
                  color: "#fff",
                  borderRadius: 2,
                  px: { xs: 2, sm: 3 },
                  py: 1,
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  fontWeight: 500,
                  "&:hover": { bgcolor: "#00897B" },
                }}
              >
                Try Again
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              sx={{
                borderColor: theme.accent,
                color: theme.accent,
                borderRadius: 2,
                px: { xs: 2, sm: 3 },
                py: 1,
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                fontWeight: 500,
                "&:hover": { bgcolor: theme.primary, borderColor: theme.accent },
              }}
            >
              Back to Home
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PaymentCallback;
