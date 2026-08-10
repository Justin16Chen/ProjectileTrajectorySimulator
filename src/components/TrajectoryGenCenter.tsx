import { useState } from 'react';
import { TrajGenParams, TrajGroup } from '../types';
import type { TrajectoryMoe } from '../simulation';
import { tab } from '../styles/theme';
import { CheckboxLabel } from './Checkbox';
import TrajectoryGenCanvas from './TrajectoryGenCanvas';
import TrajectoryOptimalAnalysis from './TrajectoryOptimalAnalysis';

type CenterTab = 'visualizer' | 'optimalAnalysis';

interface Props {
  params: TrajGenParams;
  groups: TrajGroup[];
  selectedGroupId: string | null;
  hoveredId: string | null;
  showAll: boolean;
  onShowAllChange: (showAll: boolean) => void;
  showAllOptimalTrajectories: boolean;
  onShowAllOptimalTrajectoriesChange: (show: boolean) => void;
  showOptimalTrajectories: boolean;
  onShowOptimalTrajectoriesChange: (show: boolean) => void;
  showLowestSpeedTrajectories: boolean;
  onShowLowestSpeedTrajectoriesChange: (show: boolean) => void;
  trajMoeById: Map<string, TrajectoryMoe>;
  bestMoeTrajIds: Set<string>;
  optimalLowArcTrajIds: Set<string>;
  optimalHighArcTrajIds: Set<string>;
  onHoverTraj: (id: string | null) => void;
  onParamsChange: (params: TrajGenParams) => void;
  onSaveOptimalTrajectories: () => void;
  onSetManualOptimalTrajectory: (groupId: string, trajId: string, arc: 'low' | 'high') => void;
}

const TABS: { id: CenterTab; label: string }[] = [
  { id: 'visualizer', label: 'Trajectory Visualizer' },
  { id: 'optimalAnalysis', label: 'Optimal Trajectories' },
];

export default function TrajectoryGenCenter({
  params,
  groups,
  selectedGroupId,
  hoveredId,
  showAll,
  onShowAllChange,
  showAllOptimalTrajectories,
  onShowAllOptimalTrajectoriesChange,
  showOptimalTrajectories,
  onShowOptimalTrajectoriesChange,
  showLowestSpeedTrajectories,
  onShowLowestSpeedTrajectoriesChange,
  trajMoeById,
  bestMoeTrajIds,
  optimalLowArcTrajIds,
  optimalHighArcTrajIds,
  onHoverTraj,
  onParamsChange,
  onSaveOptimalTrajectories,
  onSetManualOptimalTrajectory,
}: Props) {
  const [centerTab, setCenterTab] = useState<CenterTab>('visualizer');

  return (
    <main className="flex flex-1 min-w-0 min-h-0 bg-surface-sunken flex-col">
      <div className={tab.paneBar}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setCenterTab(t.id)}
            className={tab.pane(centerTab === t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 min-h-0 min-w-0 relative flex flex-col">
        {centerTab === 'visualizer' && (
          <>
            <div className="flex-shrink-0 flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 border-b border-edge bg-surface-panel">
              <CheckboxLabel
                checked={showAll}
                disabled={groups.length === 0}
                onChange={onShowAllChange}
                label="Show all"
              />
              <CheckboxLabel
                checked={showAllOptimalTrajectories}
                disabled={groups.length === 0}
                onChange={onShowAllOptimalTrajectoriesChange}
                label="Show all optimal"
                color="green"
              />
              <CheckboxLabel
                checked={showOptimalTrajectories}
                disabled={groups.length === 0}
                onChange={onShowOptimalTrajectoriesChange}
                label="Show optimal"
                color="green"
              />
              <CheckboxLabel
                checked={showLowestSpeedTrajectories}
                disabled={groups.length === 0}
                onChange={onShowLowestSpeedTrajectoriesChange}
                label="Show lowest speed"
              />
              <CheckboxLabel
                checked={params.showGoalPlanes}
                disabled={groups.length === 0}
                onChange={(checked) => onParamsChange({ ...params, showGoalPlanes: checked })}
                label="Show goal planes"
              />
            </div>
            <div className="flex-1 min-h-0 min-w-0 relative bg-surface">
              <TrajectoryGenCanvas
                params={params}
                groups={groups}
                selectedGroupId={selectedGroupId}
                hoveredId={hoveredId}
                showAll={showAll}
                showAllOptimalTrajectories={showAllOptimalTrajectories}
                showOptimalTrajectories={showOptimalTrajectories}
                showLowestSpeedTrajectories={showLowestSpeedTrajectories}
                trajMoeById={trajMoeById}
                bestMoeTrajIds={bestMoeTrajIds}
                optimalLowArcTrajIds={optimalLowArcTrajIds}
                optimalHighArcTrajIds={optimalHighArcTrajIds}
                onHoverTraj={onHoverTraj}
                onSetManualOptimalTrajectory={onSetManualOptimalTrajectory}
              />
            </div>
          </>
        )}
        {centerTab === 'optimalAnalysis' && (
          <div className="flex-1 min-h-0 min-w-0 relative">
            <TrajectoryOptimalAnalysis
              groups={groups}
              params={params}
              trajMoeById={trajMoeById}
              optimalLowArcTrajIds={optimalLowArcTrajIds}
              optimalHighArcTrajIds={optimalHighArcTrajIds}
              onParamsChange={onParamsChange}
              onSaveOptimalTrajectories={onSaveOptimalTrajectories}
              onSetManualOptimalTrajectory={onSetManualOptimalTrajectory}
            />
          </div>
        )}
      </div>
    </main>
  );
}
