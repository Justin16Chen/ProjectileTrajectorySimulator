import { useState, useEffect, useRef, useCallback } from 'react';
import { TrajGenParams } from '../types';
import { countTrajGenSearchSteps, type TrajGenProgress } from '../simulation';
import { Play, Loader, RefreshCw } from 'lucide-react';
import { CheckboxLabel } from './Checkbox';
import { layout, text, input, button, control } from '../styles/theme';
import { ProgressBar } from './ProgressBar';

interface Props {
  params: TrajGenParams;
  onChange: (p: TrajGenParams) => void;
  onGenerate: () => void;
  onRefine: () => void;
  generating: boolean;
  refining: boolean;
  canRefine: boolean;
  genProgress: TrajGenProgress | null;
  width: number;
}

interface RangeRowProps {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  valMin: number;
  valMax: number;
  onChangeMin: (v: number) => void;
  onChangeMax: (v: number) => void;
}

function RangeInput({ label, value, step, min, max, onCommit }: {
  label: string; value: number; step: number; min: number; max: number;
  onCommit: (v: number) => void;
}) {
  const [raw, setRaw] = useState(String(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setRaw(String(value));
  }, [value, focused]);

  function commit(str: string) {
    const stripped = str.replace(/[^0-9.-]/g, '');
    let n = parseFloat(stripped);
    if (isNaN(n)) n = min;
    n = Math.max(min, Math.min(max, n));
    setRaw(String(n));
    onCommit(n);
  }

  return (
    <div className="flex-1">
      <label className={text.label}>{label}</label>
      <input
        type="text"
        inputMode="decimal"
        step={step}
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={(e) => { setFocused(false); commit(e.target.value); }}
        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
        className={input.text}
      />
    </div>
  );
}

function snap(v: number, min: number, step: number) {
  return Math.round((v - min) / step) * step + min;
}

function RangeRow({ label, unit, min, max, step, valMin, valMax, onChangeMin, onChangeMax }: RangeRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<'min' | 'max' | null>(null);

  const valueFromX = useCallback((clientX: number) => {
    const rect = trackRef.current!.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return snap(min + ratio * (max - min), min, step);
  }, [min, max, step]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const v = valueFromX(e.clientX);
    const minPct = (valMin - min) / (max - min);
    const maxPct = (valMax - min) / (max - min);
    const pct = (v - min) / (max - min);

    let which: 'min' | 'max';
    if (pct <= minPct) {
      which = 'min';
    } else if (pct >= maxPct) {
      which = 'max';
    } else {
      which = Math.abs(pct - minPct) <= Math.abs(pct - maxPct) ? 'min' : 'max';
    }

    dragging.current = which;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    if (which === 'min') onChangeMin(Math.min(v, valMax - step));
    else onChangeMax(Math.max(v, valMin + step));
  }, [valueFromX, valMin, valMax, min, max, step, onChangeMin, onChangeMax]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const v = valueFromX(e.clientX);
    if (dragging.current === 'min') onChangeMin(Math.min(v, valMax - step));
    else onChangeMax(Math.max(v, valMin + step));
  }, [valueFromX, valMin, valMax, step, onChangeMin, onChangeMax]);

  const handlePointerUp = useCallback(() => {
    dragging.current = null;
  }, []);

  const clampPct = (v: number) => Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100));
  const minPct = clampPct(valMin);
  const maxPct = clampPct(valMax);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={text.labelInline}>{label}</label>
        <span className={text.meta}>{unit}</span>
      </div>
      <div className={`flex justify-between ${text.meta} mb-1`}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
      <div
        ref={trackRef}
        className="relative h-6 flex items-center cursor-pointer select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className={`${control.sliderTrack} w-full`}>
          {/* Active range */}
          <div
            className={control.sliderFill}
            style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
          />
          {/* Min thumb */}
          <div
            className={control.sliderThumb}
            style={{ left: `${minPct}%`, transform: `translate(-${minPct}%, -50%)` }}
          />
          {/* Max thumb */}
          <div
            className={control.sliderThumb}
            style={{ left: `${maxPct}%`, transform: `translate(-${maxPct}%, -50%)` }}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <RangeInput label="Min" value={valMin} step={step} min={min} max={valMax - step}
          onCommit={(v) => onChangeMin(Math.min(v, valMax - step))} />
        <RangeInput label="Max" value={valMax} step={step} min={valMin + step} max={max}
          onCommit={(v) => onChangeMax(Math.max(v, valMin + step))} />
      </div>
    </div>
  );
}

function NumInput({ label, unit, value, step, min, max, onChange }: {
  label: string; unit?: string; value: number; step: number; min?: number; max?: number;
  onChange: (v: number) => void;
}) {
  const [raw, setRaw] = useState(String(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setRaw(String(value));
  }, [value, focused]);

  function commit(str: string) {
    const stripped = str.replace(/[^0-9.-]/g, '');
    let n = parseFloat(stripped);
    if (isNaN(n)) n = min ?? 0;
    if (min !== undefined) n = Math.max(min, n);
    if (max !== undefined) n = Math.min(max, n);
    setRaw(String(n));
    onChange(n);
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className={text.subsectionTitle}>{label}</label>
        {unit && <span className={text.meta}>{unit}</span>}
      </div>
      <input
        type="text"
        inputMode="decimal"
        value={raw}
        step={step}
        onChange={(e) => setRaw(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={(e) => { setFocused(false); commit(e.target.value); }}
        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
        className={input.text}
      />
    </div>
  );
}

export default function TrajectoryGenLeft({
  params, onChange, onGenerate, onRefine,
  generating, refining, canRefine, genProgress, width,
}: Props) {
  function set<K extends keyof TrajGenParams>(key: K, val: TrajGenParams[K]) {
    onChange({ ...params, [key]: val });
  }

  const busy = generating || refining;

  return (
    <aside className={`${layout.panel} ${layout.panelBorderRight} overflow-y-auto`} style={{ width }}>
      <div className={layout.panelScroll}>
        <h2 className={text.sectionTitle}>Scene Setup</h2>

        {/* Scene Setup */}
        <div className="space-y-3">
          {/* Distance to goal range slider */}
          <RangeRow
            label="Distance to Goal"
            unit="m"
            min={0} max={30} step={0.1}
            valMin={params.dxMin} valMax={params.dxMax}
            onChangeMin={(v) => onChange({ ...params, dxMin: v })}
            onChangeMax={(v) => onChange({ ...params, dxMax: v })}
          />
          <NumInput label="Distance Step" unit="m" value={params.dxStep} step={0.01} min={0.01}
            onChange={(v) => onChange({ ...params, dxStep: Math.max(0.1, v) })} />
          <NumInput label="Height Offset (dy)" unit="m" value={params.dy} step={0.1}
            onChange={(v) => set('dy', v)} />
          <NumInput label="Drag Coefficient" value={params.dragCoefficient} step={0.01} min={0} max={0.2}
            onChange={(v) => set('dragCoefficient', Math.min(0.2, Math.max(0, v)))} />
          <NumInput label="Magnus Coefficient" value={params.magnusGain} step={0.01} min={-0.3} max={0.3}
            onChange={(v) => set('magnusGain', Math.min(0.3, Math.max(-0.3, v)))} />
          <NumInput label="Magnus Power" value={params.magnusPower ?? 2} step={0.1} min={1} max={3}
            onChange={(v) => set('magnusPower', Math.min(3, Math.max(1, v)))} />
        </div>

        <div className={layout.divider} />

        <h2 className={text.sectionTitle}>Search Parameters</h2>

        {/* Exit Angle Range */}
        <RangeRow
          label="Exit Angle Range"
          unit="deg"
          min={0} max={90} step={0.5}
          valMin={params.exitAngleMin} valMax={params.exitAngleMax}
          onChangeMin={(v) => set('exitAngleMin', v)}
          onChangeMax={(v) => set('exitAngleMax', v)}
        />

        {/* Impact Angle Range */}
        <RangeRow
          label="Impact Angle Range"
          unit="deg"
          min={0} max={90} step={0.5}
          valMin={params.impactAngleMin} valMax={params.impactAngleMax}
          onChangeMin={(v) => set('impactAngleMin', v)}
          onChangeMax={(v) => set('impactAngleMax', v)}
        />

        {/* Velocity Range */}
        <RangeRow
          label="Exit Velocity Range"
          unit="m/s"
          min={0} max={25} step={0.1}
          valMin={params.velocityMin} valMax={params.velocityMax}
          onChangeMin={(v) => set('velocityMin', v)}
          onChangeMax={(v) => set('velocityMax', v)}
        />

        {/* Step Sizes */}
        <div className="space-y-3">
          <h3 className={text.subsectionTitle}>Step Sizes</h3>
          <NumInput label="Angle Step" unit="deg" value={params.angleStep} step={0.1} min={0.1}
            onChange={(v) => set('angleStep', Math.max(0.1, v))} />
          <NumInput label="Velocity Step" unit="m/s" value={params.velocityStep} step={0.01} min={0.01}
            onChange={(v) => set('velocityStep', Math.max(0.01, v))} />
        </div>

        {/* Generate / Refine */}
        <CheckboxLabel
          checked={params.regeneratePerDistanceStep}
          onChange={(checked) => set('regeneratePerDistanceStep', checked)}
          disabled={busy}
          label="Regenerate per distance step"
        />
        {params.regeneratePerDistanceStep && (
          <NumInput
            label="Error Tolerance"
            unit="m"
            value={params.perDistanceErrorTolerance}
            step={0.01}
            min={0.01}
            onChange={(v) => set('perDistanceErrorTolerance', Math.max(0.01, v))}
          />
        )}

        <button
          onClick={onGenerate}
          disabled={busy}
          className={`${button.primary} ${button.block}`}
        >
          {generating ? <Loader size={16} className="animate-spin" /> : <Play size={16} />}
          {generating ? 'Generating…' : 'Generate Trajectories'}
        </button>

        <button
          onClick={onRefine}
          disabled={busy || !canRefine}
          className={`${button.secondary} ${button.block}`}
        >
          {refining ? <Loader size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          {refining ? 'Refining…' : 'Refine Trajectories'}
        </button>

        {busy && (
          <ProgressBar
            progress={genProgress?.progress ?? 0}
            detail={
              genProgress
                ? genProgress.phase === 'searching'
                  ? `Combination ${genProgress.current.toLocaleString()} / ${genProgress.total.toLocaleString()} · ${genProgress.found.toLocaleString()} candidates`
                  : `Trajectory ${genProgress.current.toLocaleString()} / ${genProgress.total.toLocaleString()} refined`
                : generating
                ? 'Starting search…'
                : 'Starting refine…'
            }
          />
        )}

        <p className={`${text.hint} text-center tabular-nums`}>
          {countTrajGenSearchSteps(params).toLocaleString()} Combinations
        </p>
      </div>
    </aside>
  );
}
