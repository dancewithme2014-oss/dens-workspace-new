"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AppWindow, Bot, BrainCircuit, Camera, ChartNoAxesCombined, Cloud, CreditCard, Database, Files, Monitor, Smartphone, Sparkles, Users, Workflow } from "lucide-react";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/content";
import { architectureLayers, architectureProjects, type ArchitectureNode } from "@/lib/architecture-data";

const icons = { users: Users, monitor: Monitor, mobile: Smartphone, app: AppWindow, brain: BrainCircuit, sparkles: Sparkles, workflow: Workflow, bot: Bot, database: Database, files: Files, cloud: Cloud, payments: CreditCard, camera: Camera, chart: ChartNoAxesCombined };
const layerX = [100, 300, 500, 700, 900, 1100];
const rowY = [112, 254];

export default function SystemArchitecture({ locale, projectId }: { locale: Locale; projectId: string }) {
  const reducedMotion = useReducedMotion();
  const project = architectureProjects.find(item => item.id === projectId) ?? architectureProjects[0];
  const [activeNodeId, setActiveNodeId] = useState(project.nodes[0].id);

  const nodeMap = useMemo(() => new Map(project.nodes.map(node => [node.id, node])), [project]);
  const activeNode = nodeMap.get(activeNodeId) ?? project.nodes[0];
  const connectedIds = useMemo(() => {
    const ids = new Set([activeNode.id, ...activeNode.connections]);
    project.nodes.forEach(node => { if (node.connections.includes(activeNode.id)) ids.add(node.id); });
    return ids;
  }, [activeNode, project.nodes]);

  const connections = project.nodes.flatMap(source => source.connections.map(targetId => {
    const target = nodeMap.get(targetId);
    if (!target) return null;
    const sourceLayer = architectureLayers.findIndex(layer => layer.id === source.layer);
    const targetLayer = architectureLayers.findIndex(layer => layer.id === target.layer);
    return { id: `${source.id}-${target.id}`, source, target, x1: layerX[sourceLayer], y1: rowY[source.row], x2: layerX[targetLayer], y2: rowY[target.row] };
  }).filter(Boolean)) as { id: string; source: ArchitectureNode; target: ArchitectureNode; x1: number; y1: number; x2: number; y2: number }[];

  return <div className="architecture">
    <div className="architecture-layout">
      <div className="architecture-scroll">
        <AnimatePresence mode="wait">
          <motion.div className="architecture-stage" key={project.id} initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0, y: -8 }} transition={{ duration: .28 }}>
            <div className="architecture-layer-labels">{architectureLayers.map(layer => <span key={layer.id}>{layer.label[locale]}</span>)}</div>
            <svg viewBox="0 0 1200 340" preserveAspectRatio="none" aria-hidden="true">
              {connections.map((line, index) => {
                const highlighted = connectedIds.has(line.source.id) && connectedIds.has(line.target.id);
                const d = `M ${line.x1} ${line.y1} C ${(line.x1 + line.x2) / 2} ${line.y1}, ${(line.x1 + line.x2) / 2} ${line.y2}, ${line.x2} ${line.y2}`;
                return <g key={line.id} className={highlighted ? "highlighted" : ""}>
                  <motion.path d={d} initial={reducedMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .45, delay: index * .018 }}/>
                  {!reducedMotion && <motion.circle r="3" initial={{ cx: line.x1, cy: line.y1, opacity: 0 }} animate={{ cx: [line.x1, line.x2], cy: [line.y1, line.y2], opacity: [0, 1, 1, 0] }} transition={{ duration: 2.8 + (index % 3) * .45, repeat: Infinity, delay: index * .22, ease: "linear" }}/>} 
                </g>;
              })}
            </svg>
            <div className="architecture-node-grid">
              {architectureLayers.map(layer => <div className="architecture-column" key={layer.id}>{[0, 1].map(row => {
                const nodes = project.nodes.filter(node => node.layer === layer.id && node.row === row);
                return <div className="architecture-slot" key={row}>{nodes.map(node => {
                  const Icon = icons[node.icon];
                  const related = connectedIds.has(node.id);
                  return <motion.button type="button" key={node.id} className={`architecture-node ${activeNode.id === node.id ? "active" : ""} ${related ? "related" : "dimmed"}`} onMouseEnter={() => setActiveNodeId(node.id)} onFocus={() => setActiveNodeId(node.id)} onClick={() => setActiveNodeId(node.id)} whileHover={reducedMotion ? undefined : { y: -3 }} layout>
                    <span><Icon/></span><b>{node.label[locale]}</b>
                  </motion.button>;
                })}</div>;
              })}</div>)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        <motion.aside className="architecture-details" key={`${project.id}-${activeNode.id}`} initial={reducedMotion ? false : { opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={reducedMotion ? undefined : { opacity: 0, x: -8 }}>
          <p>{project.name}</p><h3>{activeNode.label[locale]}</h3><small>{architectureLayers.find(layer => layer.id === activeNode.layer)?.label[locale]}</small>
          <p>{activeNode.description[locale]}</p>
          <b>{locale === "ru" ? "Связанные зависимости" : "Connected dependencies"}</b>
          <ul>{[...connectedIds].filter(id => id !== activeNode.id).map(id => <li key={id}>{nodeMap.get(id)?.label[locale]}</li>)}</ul>
          <div><strong>{project.subtitle[locale]}</strong><span>{project.description[locale]}</span></div>
        </motion.aside>
      </AnimatePresence>
    </div>
  </div>;
}
