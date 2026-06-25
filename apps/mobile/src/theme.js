export const COLORS = {
  backgroundBase: '#0A0A0F',
  cardBackground: '#12121A',
  cardBackgroundHover: '#1A1A2E',
  primaryPurple: '#7C3AED',
  lightPurple: '#9F7AEA',
  purpleTint: 'rgba(124, 58, 237, 0.15)',
  whiteTextPrimary: '#FFFFFF',
  greyTextSecondary: '#A0A0B0',
  greyTextTertiary: '#6B6B80',
  borderSubtle: '#2A2A3E',
  greenLowWait: '#10B981',
  greenBg: 'rgba(16, 185, 129, 0.15)',
  orangeMedWait: '#F59E0B',
  orangeBg: 'rgba(245, 158, 11, 0.15)',
  redHighWait: '#EF4444',
  redBg: 'rgba(239, 68, 68, 0.15)',
  successGreen: '#10B981',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
};

export const TYPOGRAPHY = {
  h1: {
    fontFamily: 'ArchivoBlack_400Regular',
    fontSize: 32,
    color: COLORS.whiteTextPrimary,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: 'ArchivoBlack_400Regular',
    fontSize: 20,
    color: COLORS.whiteTextPrimary,
  },
  h3: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.whiteTextPrimary,
  },
  body: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: COLORS.greyTextSecondary,
    lineHeight: 22,
  },
  small: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
    color: COLORS.greyTextSecondary,
  },
  scoreDisplay: {
    fontFamily: 'ArchivoBlack_400Regular',
    fontSize: 64,
    color: COLORS.whiteTextPrimary,
  },
  rankDisplay: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: COLORS.whiteTextPrimary,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  massive: 48,
};

export const BORDER_RADIUS = {
  cards: 24,
  buttons: 100,
  pills: 20,
  inputs: 16,
  modalTop: 32,
  largeCards: 28,
};

export const SHADOWS = {
  card: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  strongCard: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
};
