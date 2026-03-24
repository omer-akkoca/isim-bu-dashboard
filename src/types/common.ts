export interface ILocation {
  city: string;
  district: string;
}

export interface ISocialMedia {
  platform: SocialMediaPlatformType;
  url: string;
}

type SocialMediaPlatformType =
  | 'linkedin'
  | 'github'
  | 'twitter'
  | 'instagram'
  | 'youtube'
  | 'portfolio'
  | 'facebook'
  | 'other';

export interface ActionProps<T> {
  data: T;
  onSuccess?: () => void;
  onError?: () => void;
}
