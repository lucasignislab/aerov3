import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  pgEnum,
  serial,
  date,
  doublePrecision,
  primaryKey,
  foreignKey,
  unique,
  index,
} from 'drizzle-orm/pg-core';

// ============ ENUMS ============
export const userRoleEnum = pgEnum('user_role', [
  'owner',
  'admin',
  'member',
  'guest',
]);

export const issuePriorityEnum = pgEnum('issue_priority', [
  'urgent',
  'high',
  'medium',
  'low',
]);

export const issueStateGroupEnum = pgEnum('issue_state_group', [
  'backlog',
  'unstarted',
  'started',
  'completed',
  'cancelled',
]);

export const viewTypeEnum = pgEnum('view_type', [
  'list',
  'kanban',
  'calendar',
  'gantt',
]);

// ============ USERS ============
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  displayName: varchar('display_name', { length: 255 }),
  avatarUrl: text('avatar_url'),
  role: userRoleEnum('role').default('member'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  isOnboarded: boolean('is_onboarded').default(false),
});

// ============ WORKSPACES ============
export const workspaces = pgTable(
  'workspaces',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    logo: text('logo'),
    ownerId: uuid('owner_id').references(() => users.id, {
      onDelete: 'cascade',
    }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    ownerIdx: index('workspace_owner_idx').on(table.ownerId),
  })
);

// ============ WORKSPACE MEMBERS ============
export const workspaceMembers = pgTable(
  'workspace_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id').references(() => workspaces.id, {
      onDelete: 'cascade',
    }),
    memberId: uuid('member_id').references(() => users.id, {
      onDelete: 'cascade',
    }),
    role: userRoleEnum('role').default('member'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    uniq: unique().on(table.workspaceId, table.memberId),
    workspaceIdx: index('wm_workspace_idx').on(table.workspaceId),
    memberIdx: index('wm_member_idx').on(table.memberId),
  })
);

// ============ PROJETOS ============
export const projects = pgTable(
  'projects',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id').references(() => workspaces.id, {
      onDelete: 'cascade',
    }),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    identifier: varchar('identifier', { length: 12 }).notNull(),
    icon: varchar('icon', { length: 50 }).default('📋'),
    coverImage: text('cover_image'),
    createdBy: uuid('created_by').references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    workspaceIdx: index('project_workspace_idx').on(table.workspaceId),
    identifierUniq: unique().on(table.workspaceId, table.identifier),
  })
);
// CONTINUA... (vamos fazer passo a passo)
// ============ ISSUE STATES ============
export const issueStates = pgTable(
  'issue_states',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    color: varchar('color', { length: 7 }).default('#3f3f46'),
    position: integer('position').notNull(),
    group: issueStateGroupEnum('group').notNull(),
    projectId: uuid('project_id').references(() => projects.id, {
      onDelete: 'cascade',
    }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    projectIdx: index('state_project_idx').on(table.projectId),
    nameUniq: unique().on(table.projectId, table.name),
  })
)

// ============ ISSUES ============
export const issues = pgTable(
  'issues',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id').references(() => projects.id, {
      onDelete: 'cascade',
    }).notNull(),
    stateId: uuid('state_id').references(() => issueStates.id, {
      onDelete: 'set null',
    }),
    
    // Identificação
    sequenceId: serial('sequence_id'),
    name: varchar('name', { length: 500 }).notNull(),
    descriptionId: uuid('description_id'),
    
    // Metadados
    priority: issuePriorityEnum('priority').default('medium'),
    estimate: integer('estimate'),
    startDate: date('start_date'),
    targetDate: date('target_date'),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    
    // Atribuição
    assigneeId: uuid('assignee_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    createdBy: uuid('created_by').references(() => users.id).notNull(),
    
    // Controle
    sortOrder: doublePrecision('sort_order').default(0),
    isDraft: boolean('is_draft').default(false),
    archivedAt: timestamp('archived_at', { withTimezone: true }),
    
    // Timestamps
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    projectIdx: index('issue_project_idx').on(table.projectId),
    stateIdx: index('issue_state_idx').on(table.stateId),
    assigneeIdx: index('issue_assignee_idx').on(table.assigneeId),
    sequenceIdx: index('issue_sequence_idx').on(table.projectId, table.sequenceId),
  })
)

// ============ ISSUE DESCRIPTIONS ============
export const issueDescriptions = pgTable('issue_descriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  issueId: uuid('issue_id').references(() => issues.id, {
    onDelete: 'cascade',
  }).unique(),
  content: jsonb('content').notNull().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

// ============ LABELS ============
export const labels = pgTable(
  'labels',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    color: varchar('color', { length: 7 }).default('#3f3f46'),
    projectId: uuid('project_id').references(() => projects.id, {
      onDelete: 'cascade',
    }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    projectIdx: index('label_project_idx').on(table.projectId),
    nameUniq: unique().on(table.projectId, table.name),
  })
)

// ============ ISSUE LABELS ============
export const issueLabels = pgTable(
  'issue_labels',
  {
    issueId: uuid('issue_id').references(() => issues.id, {
      onDelete: 'cascade',
    }),
    labelId: uuid('label_id').references(() => labels.id, {
      onDelete: 'cascade',
    }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.issueId, table.labelId] }),
  })
)
