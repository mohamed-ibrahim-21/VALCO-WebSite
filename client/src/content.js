import { Package, HardHat, Wrench, Headset, Flame, FlaskConical, Zap, Droplets, Ship, Building2 } from "lucide-react";

// Services: [anchor id, icon, title key, short text key, long text key]
export const SERVICES = [
  ["sourcing", Package, "s1", "s1d", "s1long"],
  ["consultation", HardHat, "s2", "s2d", "s2long"],
  ["maintenance", Wrench, "s3", "s3d", "s3long"],
  ["after-sales", Headset, "s4", "s4d", "s4long"],
];

// Industries: [anchor id, icon, name key, text key, typical products key]
export const INDUSTRIES = [
  ["oil-gas", Flame, "ind1", "ind1d", "ind1p"],
  ["petrochemical", FlaskConical, "ind2", "ind2d", "ind2p"],
  ["power", Zap, "ind3", "ind3d", "ind3p"],
  ["water", Droplets, "ind4", "ind4d", "ind4p"],
  ["marine", Ship, "ind5", "ind5d", "ind5p"],
  ["building", Building2, "ind6", "ind6d", "ind6p"],
];
