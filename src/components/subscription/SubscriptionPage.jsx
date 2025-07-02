import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Container,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Star as StarIcon,
  Event as EventIcon,
  Visibility as VisibilityIcon,
  Speed as SpeedIcon,
  Support as SupportIcon,
  CreditCard as CreditCardIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import Header from '../common/Header';
import Footer from '../common/Footer';

const premiumFeatures = [
  'Priority event access',
  'Premium marketplace listings',
  'Priority customer support',
  'Unlimited Q&A posts',
  'Advanced search filters',
  'Event notifications',
  'Exclusive campus events',
  'No ads experience',
  'Student verification available',
  'Academic calendar integration',
  'Study group matching',
  'Campus resource access',
];

const plans = [
  {
    label: 'Monthly',
    price: 4.99,
    duration: '1 Month',
    subtitle: '$4.99/mo',
    value: 'monthly',
  },
  {
    label: 'Quarterly',
    price: 14,
    duration: '3 Months',
    subtitle: '$4.67/mo',
    value: 'quarterly',
  },
  {
    label: 'Half-Yearly',
    price: 23,
    duration: '6 Months',
    subtitle: '$3.83/mo',
    value: 'halfyearly',
  },
];

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleBuy = () => setShowPaymentDialog(true);
  const handlePayment = () => {
    alert('Payment processing... This would integrate with a payment gateway.');
    setShowPaymentDialog(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Header />
      <Container maxWidth="sm">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Chip label="Premium" color="warning" icon={<StarIcon />} sx={{ fontWeight: 700, fontSize: 18, mb: 2, px: 2, py: 1, borderRadius: 2 }} />
          <Typography variant="h2" fontWeight={800} color="white" mb={2}>
            Unlock Premium Access
          </Typography>
          <Typography variant="h6" color="rgba(255,255,255,0.92)" maxWidth="500px" mx="auto">
            Get the best campus experience with exclusive features, priority access, and more. Choose your plan and upgrade instantly!
          </Typography>
        </Box>

        {/* Pricing Options */}
        <Grid container spacing={3} justifyContent="center" mb={4}>
          {plans.map((plan) => (
            <Grid item xs={12} sm={4} key={plan.value}>
              <Card
                onClick={() => setSelectedPlan(plan)}
                sx={{
                  borderRadius: 4,
                  boxShadow: selectedPlan.value === plan.value ? 6 : 2,
                  border: selectedPlan.value === plan.value ? '2.5px solid #F59E0B' : '2px solid #e5e7eb',
                  cursor: 'pointer',
                  background: selectedPlan.value === plan.value
                    ? 'linear-gradient(135deg, #fff7ed 0%, #fff 100%)'
                    : 'white',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                  p: 2,
                }}
              >
                <Typography variant="h5" fontWeight={700} color="#F59E0B" mb={1}>
                  {plan.label}
                </Typography>
                <Typography variant="h3" fontWeight={800} color="#222" mb={0.5}>
                  ${plan.price}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  {plan.duration}
                </Typography>
                <Chip label={plan.subtitle} color="warning" size="small" sx={{ fontWeight: 600 }} />
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Features List */}
        <Card sx={{ borderRadius: 4, boxShadow: 3, p: 4, mb: 5 }}>
          <Typography variant="h4" fontWeight={700} color="#2563EB" mb={2} textAlign="center">
            All Premium Features
          </Typography>
          <List>
            {premiumFeatures.map((feature, idx) => (
              <ListItem key={feature} sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckIcon color="success" />
                </ListItemIcon>
                <ListItemText primary={feature} primaryTypographyProps={{ fontSize: '1.08rem', fontWeight: 500 }} />
              </ListItem>
            ))}
          </List>
        </Card>

        {/* Buy Button */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
              color: 'white',
              fontWeight: 700,
              fontSize: 22,
              px: 6,
              py: 2,
              borderRadius: 3,
              boxShadow: 3,
              '&:hover': {
                background: 'linear-gradient(135deg, #D97706 0%, #EA580C 100%)',
              },
            }}
            onClick={handleBuy}
          >
            Buy Premium – ${selectedPlan.price} {selectedPlan.duration !== '1 Month' ? `for ${plan.duration}` : '/month'}
          </Button>
        </Box>

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h5" fontWeight={600}>
              Complete Your Subscription
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Premium – {selectedPlan.label} (${selectedPlan.price})
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentMethod}
                  label="Payment Method"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <MenuItem value="card">Credit/Debit Card</MenuItem>
                  <MenuItem value="paypal">PayPal</MenuItem>
                  <MenuItem value="apple">Apple Pay</MenuItem>
                </Select>
              </FormControl>
              {paymentMethod === 'card' && (
                <>
                  <TextField
                    fullWidth
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    InputProps={{
                      startAdornment: <CreditCardIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        placeholder="MM/YY"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="CVV"
                        placeholder="123"
                        InputProps={{
                          endAdornment: <LockIcon sx={{ color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
              <Alert severity="info" icon={<LockIcon />}>
                Your payment information is encrypted and secure. We use industry-standard SSL encryption.
              </Alert>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handlePayment}
              sx={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #D97706 0%, #EA580C 100%)'
                }
              }}
            >
              Complete Payment
            </Button>
          </DialogActions>
        </Dialog>

        {/* FAQ Section */}
        <Box sx={{ background: 'white', borderRadius: 4, p: 6, mt: 6 }}>
          <Typography variant="h3" fontWeight={700} textAlign="center" mb={4} color="text.primary">
            Frequently Asked Questions
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Can I cancel my subscription anytime?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                How do I verify my student status?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                For Premium, you can upload a valid student ID or use your university email address for verification.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                What payment methods do you accept?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We accept all major credit cards, PayPal, and Apple Pay. All payments are processed securely through Stripe.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Is there a free trial?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Yes! New users get a 7-day free trial of Premium features. No credit card required to start your trial.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
} 