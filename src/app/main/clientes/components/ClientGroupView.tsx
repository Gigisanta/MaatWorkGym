'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Clock, Dumbbell, Activity, Crown, Search } from 'lucide-react';
import { SocioConEstado, GroupByOption } from '../types/client';
import { GroupFilterTabs } from './GroupFilterTabs';
import { SmartSearchBar } from './SmartSearchBar';
import { GroupSummaryCard } from './GroupSummaryCard';
import { ClientCompactRow } from './ClientCompactRow';
import { ClientPagination } from './ClientPagination';
import { useGroupedClients } from '../hooks/useGroupedClients';

interface ClientGroupViewProps {
  socios: SocioConEstado[];
  onViewClient: (socio: SocioConEstado) => void;
  onEditClient: (socio: SocioConEstado) => void;
  onRenewClient: (socio: SocioConEstado) => void;
  onNotifyClient: (socio: SocioConEstado) => void;
}

export function ClientGroupView({
  socios,
  onViewClient,
  onEditClient,
  onRenewClient,
  onNotifyClient,
}: ClientGroupViewProps) {
  const [groupBy, setGroupBy] = useState<GroupByOption>('plan');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['plan']));
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const { getGroupedItems, totalClients, pageSize } = useGroupedClients(
    socios,
    groupBy,
    searchQuery,
  );

  const counts = {
    plan: Object.keys(socios.reduce((acc, s) => ({ ...acc, [s.planId]: true }), {})).length,
    horario: 3,
    grupoMuscular: Object.keys(
      socios.reduce((acc, s) => ({ ...acc, [s.grupoMuscular || 'sin_asignar']: true }), {}),
    ).length,
    estado: 3,
  };

  const toggleGroup = useCallback((key: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const toggleClient = useCallback((id: string) => {
    setExpandedClients((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const getGroupIcon = (groupBy: GroupByOption, key: string) => {
    switch (groupBy) {
      case 'plan':
        return key.toLowerCase().includes('premium') || key.toLowerCase().includes('anual') ? (
          <Crown className="w-5 h-5" />
        ) : (
          <Sparkles className="w-5 h-5" />
        );
      case 'horario':
        return <Clock className="w-5 h-5" />;
      case 'grupoMuscular':
        return <Dumbbell className="w-5 h-5" />;
      case 'estado':
        return <Activity className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Search & Filter Header */}
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <SmartSearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <div className="w-full lg:w-auto p-1 rounded-lg bg-muted border border-border flex items-center gap-1">
          <GroupFilterTabs activeTab={groupBy} onTabChange={setGroupBy} counts={counts} />
        </div>
      </div>

      {/* Results Section */}
      {totalClients === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32 rounded-2xl border border-dashed border-border"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
            <Search size={40} />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {searchQuery ? 'Búsqueda sin resultados' : 'Directorio Vacío'}
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            {searchQuery
              ? `No encontramos coincidencias para "${searchQuery}".`
              : 'Aún no tienes socios registrados.'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={groupBy}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {getGroupedItems.map((group) => (
                <GroupSummaryCard
                  key={group.key}
                  title={group.label}
                  subtitle={group.subtitle}
                  icon={getGroupIcon(groupBy, group.key)}
                  count={group.items.length}
                  isExpanded={expandedGroups.has(group.key)}
                  onToggleExpand={() => toggleGroup(group.key)}
                >
                  <div className="space-y-2 mt-4">
                    {group.items.map((socio) => (
                      <ClientCompactRow
                        key={socio.id}
                        socio={socio}
                        isExpanded={expandedClients.has(socio.id)}
                        onToggleExpand={() => toggleClient(socio.id)}
                        onView={() => onViewClient(socio)}
                        onEdit={() => onEditClient(socio)}
                        onRenew={() => onRenewClient(socio)}
                        onNotify={() => onNotifyClient(socio)}
                      />
                    ))}
                  </div>
                </GroupSummaryCard>
              ))}
            </motion.div>
          </AnimatePresence>

          {totalClients > pageSize && (
            <div className="pt-6">
              <ClientPagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalClients / pageSize)}
                totalItems={totalClients}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
