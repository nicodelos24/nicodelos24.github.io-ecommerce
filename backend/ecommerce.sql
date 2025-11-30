CREATE DATABASE IF NOT EXISTS ecommerce;
USE ecommerce;

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR (255) NOT NULL,
    contrasena VARCHAR (255) NOT NULL,
    nombre_usuario VARCHAR (255),
    apellido_usuario VARCHAR (255),
    telefono VARCHAR (255),
    foto_perfil VARCHAR (255)
);

CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR (255),
    descripcion_cat VARCHAR (255),
    img_src VARCHAR (255),
    product_count INT
);


CREATE TABLE producto (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR (255),
    descripcion_prod VARCHAR (255),
    costo DECIMAL (10,2),
    moneda VARCHAR (255),
    stock INT,
    sold_count INT,
    imagen_principal VARCHAR (255),
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE comentario_producto (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    fecha_hora DATETIME,
    puntaje INT,
    texto VARCHAR (255),
    id_producto INT,
    id_usuario INT,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE carrito (
    id_carrito INT AUTO_INCREMENT PRIMARY KEY,
    fecha_creacion DATETIME,
    estado_carrito VARCHAR (255),
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE item_carrito (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    cantidad INT,
    precio_unitario DECIMAL (10,2),
    moneda_carrito VARCHAR (255),
    id_carrito INT,
    id_producto INT,
    FOREIGN KEY (id_carrito) REFERENCES carrito(id_carrito),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

CREATE TABLE direccion_envio (
    id_direccion INT AUTO_INCREMENT PRIMARY KEY,
    departamento VARCHAR (255),
    localidad VARCHAR (255),
    calle VARCHAR (255),
    numero VARCHAR (255),
    esquina VARCHAR (255),
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);


CREATE TABLE pago (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    tipo_pago VARCHAR (255),
    card_number VARCHAR (255),
    card_exp VARCHAR (255),
    card_cvv VARCHAR (255),
    bank_name VARCHAR (255),
    bank_account VARCHAR (255)
);

CREATE TABLE orden (
    id_orden INT AUTO_INCREMENT PRIMARY KEY,
    fecha_orden DATETIME,
    total DECIMAL (10, 2),
    estado_orden VARCHAR (255),
    tipo_envio VARCHAR (255),
    porcentaje_envio DECIMAL (10,2),
    id_usuario INT,
    id_direccion INT,
    id_pago INT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_direccion) REFERENCES direccion_envio(id_direccion),
    FOREIGN KEY (id_pago) REFERENCES pago(id_pago)
);

CREATE TABLE detalle_orden (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    cantidad INT,
    precio_unitario_det DECIMAL (10,2),
    moneda_det VARCHAR (255),
    id_orden INT,
    id_producto INT,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    FOREIGN KEY (id_orden) REFERENCES orden(id_orden)
);



