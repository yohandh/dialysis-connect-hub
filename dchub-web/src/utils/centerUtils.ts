
import { DialysisCenter } from "@/data/centerData";

// Format operating hours for display
export const formatOperatingHours = (center: DialysisCenter) => {
  // Check if all weekdays have the same hours
  const weekdayHours = center.operatingHours.monday;
  const allWeekdaysSame = [
    center.operatingHours.tuesday,
    center.operatingHours.wednesday,
    center.operatingHours.thursday,
    center.operatingHours.friday
  ].every(hours => hours === weekdayHours);

  // Check if weekend days have the same hours
  const weekendSame = center.operatingHours.saturday === center.operatingHours.sunday;

  if (allWeekdaysSame && weekendSame && center.operatingHours.saturday === weekdayHours) {
    return `All days: ${weekdayHours}`;
  } else if (allWeekdaysSame) {
    const result = [`Mon-Fri: ${weekdayHours}`];
    if (center.operatingHours.saturday !== 'Closed') {
      result.push(`Sat: ${center.operatingHours.saturday}`);
    }
    if (center.operatingHours.sunday !== 'Closed') {
      result.push(`Sun: ${center.operatingHours.sunday}`);
    }
    return result.join('; ');
  } else {
    // Just show M-F and weekend as groups
    return "Various hours; see details";
  }
};
