CREATE TABLE [agreements] (
	[id] int IDENTITY(1, 1),
	[date_created] date NOT NULL,
	[property_id] int,
	[client_id] int,
	[employee_id] int,
	[operation_id] int,
	[period] varchar(100),
	[notes] text,
	CONSTRAINT [agreements_pkey] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [cash_desk] (
	[id] int IDENTITY(1, 1),
	[agreement_id] int,
	[employee_id] int,
	[client_id] int,
	[date] date NOT NULL,
	[amount] decimal(18,2) NOT NULL,
	CONSTRAINT [cash_desk_pkey] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [clients] (
	[id] int IDENTITY(1, 1),
	[full_name] varchar(255) NOT NULL,
	[address] varchar(500),
	[phone] varchar(20),
	[client_type] varchar(50) NOT NULL,
	CONSTRAINT [clients_pkey] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [districts] (
	[id] int IDENTITY(1, 1),
	[name] varchar(255) NOT NULL,
	CONSTRAINT [districts_pkey] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [employees] (
	[id] int IDENTITY(1, 1),
	[full_name] varchar(255) NOT NULL,
	CONSTRAINT [employees_pkey] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [operations] (
	[id] int IDENTITY(1, 1),
	[name] varchar(255) NOT NULL,
	CONSTRAINT [operations_pkey] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [properties] (
	[id] int IDENTITY(1, 1),
	[type_id] int,
	[district_id] int,
	[address] varchar(500) NOT NULL,
	[cost] decimal(18,2) NOT NULL,
	[area] decimal(10,2) NOT NULL,
	[description] text,
	[owner_id] int,
	[status] varchar(50) NOT NULL,
	CONSTRAINT [properties_pkey] PRIMARY KEY([id])
);
--> statement-breakpoint
CREATE TABLE [property_types] (
	[id] int IDENTITY(1, 1),
	[name] varchar(255) NOT NULL,
	CONSTRAINT [property_types_pkey] PRIMARY KEY([id])
);
--> statement-breakpoint
ALTER TABLE [agreements] ADD CONSTRAINT [agreements_property_id_properties_id_fk] FOREIGN KEY ([property_id]) REFERENCES [properties]([id]);--> statement-breakpoint
ALTER TABLE [agreements] ADD CONSTRAINT [agreements_client_id_clients_id_fk] FOREIGN KEY ([client_id]) REFERENCES [clients]([id]);--> statement-breakpoint
ALTER TABLE [agreements] ADD CONSTRAINT [agreements_employee_id_employees_id_fk] FOREIGN KEY ([employee_id]) REFERENCES [employees]([id]);--> statement-breakpoint
ALTER TABLE [agreements] ADD CONSTRAINT [agreements_operation_id_operations_id_fk] FOREIGN KEY ([operation_id]) REFERENCES [operations]([id]);--> statement-breakpoint
ALTER TABLE [cash_desk] ADD CONSTRAINT [cash_desk_agreement_id_agreements_id_fk] FOREIGN KEY ([agreement_id]) REFERENCES [agreements]([id]);--> statement-breakpoint
ALTER TABLE [cash_desk] ADD CONSTRAINT [cash_desk_employee_id_employees_id_fk] FOREIGN KEY ([employee_id]) REFERENCES [employees]([id]);--> statement-breakpoint
ALTER TABLE [cash_desk] ADD CONSTRAINT [cash_desk_client_id_clients_id_fk] FOREIGN KEY ([client_id]) REFERENCES [clients]([id]);--> statement-breakpoint
ALTER TABLE [properties] ADD CONSTRAINT [properties_type_id_property_types_id_fk] FOREIGN KEY ([type_id]) REFERENCES [property_types]([id]);--> statement-breakpoint
ALTER TABLE [properties] ADD CONSTRAINT [properties_district_id_districts_id_fk] FOREIGN KEY ([district_id]) REFERENCES [districts]([id]);--> statement-breakpoint
ALTER TABLE [properties] ADD CONSTRAINT [properties_owner_id_clients_id_fk] FOREIGN KEY ([owner_id]) REFERENCES [clients]([id]);