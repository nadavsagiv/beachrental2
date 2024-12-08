import React, { useState } from 'react';
import type { RentalFormData, RentalType, PaymentMethod } from '../../shared/types';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stepper,
  Step,
  StepLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Grid,
  Container,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import {
  BeachAccess as BeachAccessIcon,
  Surfing as SurfingIcon,
  Pool as PoolIcon,
} from '@mui/icons-material';
import { useRentals } from '../../hooks/useRentals';
import Clock from '../Clock';
import BedsTab from '../tabs/BedsTab';
import SupsTab from '../tabs/SupsTab';
import SnorkelsTab from '../tabs/SnorkelsTab';
import DailySummary from '../DailySummary';

// Rental stages
const STAGES = ['בחירת קטגוריה', 'פרטי השכרה', 'תשלום'];

const initialFormData: RentalFormData = {
  type: null,
  numPeople: 1,
  customerName: '',
  notes: '',
  paymentMethod: 'CASH',
  discount: 0,
  extraTime: 0,
  duration: 60, // default duration in minutes
  numItems: 1, // default number of items
};

const DURATION_OPTIONS = [
  { value: 30, label: 'חצי שעה - ₪60' },
  { value: 60, label: 'שעה - ₪100' },
];

export default function Layout() {
  const { createRental } = useRentals();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<RentalFormData>(initialFormData);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleNext = () => {
    if (activeStep === STAGES.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setActiveStep(0);
    setFormData(initialFormData);
  };

  const handleSubmit = () => {
    if (!formData.type || !formData.customerName) return;

    createRental.mutate({
      type: formData.type,
      numPeople: formData.numPeople,
      customerName: formData.customerName,
      notes: formData.notes,
      paymentMethod: formData.paymentMethod,
      duration: formData.type === 'SUP' ? formData.duration : undefined,
      numItems: formData.type === 'SUP' ? formData.numItems : undefined,
    });

    handleClose();
  };

  const handleTypeSelect = (type: RentalType) => {
    setFormData(prev => ({ ...prev, type }));
    handleNext();
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ py: 4 }}>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} md={4}>
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                    background: 'linear-gradient(135deg, #64B5F6 0%, #2196F3 100%)',
                  }}
                  onClick={() => handleTypeSelect('BED')}
                >
                  <CardContent sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    color: 'white',
                    p: 4,
                  }}>
                    <BeachAccessIcon sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h5" component="div">
                      מיטה
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                    background: 'linear-gradient(135deg, #81C784 0%, #4CAF50 100%)',
                  }}
                  onClick={() => handleTypeSelect('SUP')}
                >
                  <CardContent sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    color: 'white',
                    p: 4,
                  }}>
                    <SurfingIcon sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h5" component="div">
                      סאפ
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                    background: 'linear-gradient(135deg, #FFB74D 0%, #FF9800 100%)',
                  }}
                  onClick={() => handleTypeSelect('SNORKEL')}
                >
                  <CardContent sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    color: 'white',
                    p: 4,
                  }}>
                    <PoolIcon sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h5" component="div">
                      שנורקל
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <TextField
              fullWidth
              margin="normal"
              label="שם לקוח"
              value={formData.customerName}
              onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              required
            />
            
            {formData.type === 'BED' && (
              <TextField
                fullWidth
                margin="normal"
                label="מספר אנשים"
                type="number"
                value={formData.numPeople}
                onChange={(e) => setFormData(prev => ({ ...prev, numPeople: Number(e.target.value) }))}
                inputProps={{ min: 1 }}
              />
            )}

            {formData.type === 'SUP' && (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel>זמן השכרה</InputLabel>
                  <Select
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
                    label="זמן השכרה"
                  >
                    {DURATION_OPTIONS.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  margin="normal"
                  label="מספר סאפים"
                  type="number"
                  value={formData.numItems}
                  onChange={(e) => setFormData(prev => ({ ...prev, numItems: Number(e.target.value) }))}
                  inputProps={{ min: 1, max: 4 }}
                  helperText="מקסימום 4 סאפים להשכרה"
                />

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  מחיר: ₪{formData.duration === 30 ? 60 : 100} לסאפ
                </Typography>
              </>
            )}

            <TextField
              fullWidth
              margin="normal"
              label="הערות"
              multiline
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />

            <TextField
              fullWidth
              margin="normal"
              label="הנחה"
              type="number"
              value={formData.discount}
              onChange={(e) => setFormData(prev => ({ ...prev, discount: Number(e.target.value) }))}
              inputProps={{ min: 0 }}
            />
          </Box>
        );

      case 2:
        return (
          <Box>
            <RadioGroup
              value={formData.paymentMethod}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value as PaymentMethod }))}
            >
              <FormControlLabel value="CASH" control={<Radio />} label="מזומן" />
              <FormControlLabel value="CREDIT" control={<Radio />} label="אשראי" />
            </RadioGroup>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Clock />
      </Box>
      
      <DailySummary />

      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          centered
        >
          <Tab label="מיטות" />
          <Tab label="סאפים" />
          <Tab label="שנורקלים" />
        </Tabs>
      </Paper>

      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => setDialogOpen(true)}
          fullWidth
        >
          השכרה חדשה
        </Button>
      </Box>

      {selectedTab === 0 && <BedsTab />}
      {selectedTab === 1 && <SupsTab />}
      {selectedTab === 2 && <SnorkelsTab />}

      <Dialog 
        open={isDialogOpen} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            bgcolor: 'background.default',
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>השכרה חדשה</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {STAGES.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {renderStepContent(activeStep)}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose}>ביטול</Button>
          {activeStep > 0 && (
            <Button onClick={handleBack}>
              חזור
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              (activeStep === 0 && !formData.type) ||
              (activeStep === 1 && !formData.customerName) ||
              (activeStep === 2 && !formData.paymentMethod)
            }
          >
            {activeStep === STAGES.length - 1 ? 'סיום' : 'הבא'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 