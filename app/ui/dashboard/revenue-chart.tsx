import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { Applicant } from '@/app/lib/definitions';

// Pie chart utility
function getPieSegments(applicants: Applicant[]) {
  const parsed = applicants.map((app) => ({
    ...app,
    experienceValue: app.experience
      ? parseFloat(app.experience.replace(/[^\d.]/g, ''))
      : 0,
  }));
  const total = parsed.reduce((sum, app) => sum + app.experienceValue, 0);
  let cumulative = 0;
  return parsed.map((app, i) => {
    const value = app.experienceValue;
    const startAngle = cumulative;
    const angle = total === 0 ? 0 : (value / total) * 360;
    cumulative += angle;
    return {
      ...app,
      value,
      startAngle,
      endAngle: cumulative,
      color: PIE_COLORS[i % PIE_COLORS.length],
    };
  });
}

const PIE_COLORS = [
  '#60a5fa', // blue-400
  '#fbbf24', // yellow-400
  '#34d399', // green-400
  '#f87171', // red-400
  '#a78bfa', // purple-400
  '#f472b6', // pink-400
  '#38bdf8', // sky-400
  '#facc15', // yellow-400
  '#4ade80', // green-400
  '#fb7185', // rose-400
  '#818cf8', // indigo-400
  '#f472b6', // pink-400
];

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M', cx, cy,
    'L', start.x, start.y,
    'A', r, r, 0, largeArcFlag, 0, end.x, end.y,
    'Z'
  ].join(' ');
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle - 90) * Math.PI / 180.0;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

export default function ExperiencePieChart({
  applicants,
}: {
  applicants: Applicant[];
}) {
  const size = 320;
  const radius = size / 2 - 16;
  const cx = size / 2;
  const cy = size / 2;

  if (!applicants || applicants.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  const segments = getPieSegments(applicants);

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Experience Pie Chart
      </h2>
      <div className="rounded-xl bg-gray-50 p-4 flex flex-col items-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {segments.map((seg, i) => (
            seg.value > 0 && (
              <path
                key={seg.id}
                d={describeArc(cx, cy, radius, seg.startAngle, seg.endAngle)}
                fill={seg.color}
                stroke="#fff"
                strokeWidth={2}
              />
            )
          ))}
        </svg>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {segments.map((seg) => (
            <div key={seg.id} className="flex items-center gap-2">
              <span
                className="inline-block w-4 h-4 rounded"
                style={{ background: seg.color }}
              ></span>
              <span className="text-sm text-gray-700">{seg.name} ({seg.value})</span>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Last 12 months</h3>
        </div>
      </div>
    </div>
  );
}