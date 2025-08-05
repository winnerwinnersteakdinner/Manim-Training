from manim import *

class TarskiPlankProblem(ThreeDScene):
    def construct(self):
        # Set up the 3D camera
        self.set_camera_orientation(phi=75 * DEGREES, theta=30 * DEGREES)

        # Title text
        title = Text("Five puzzles for thinking outside the box").to_edge(UP)
        self.add_fixed_in_frame_mobjects(title)

        # Create a 3D axis for context
        axes = ThreeDAxes()
        self.add(axes)

        # Sphere and Cylinder
        radius = 2
        sphere = Sphere(radius=radius, resolution=(24, 24)).set_opacity(0.3)
        cylinder = Cylinder(radius=radius, height=4, direction=OUT).set_opacity(0.2)
        self.add(sphere, cylinder)

        # Define the two cutting planes (planks)
        z1 = 0.5
        z2 = 1.5
        plane1 = Surface(
            lambda u, v: np.array([u, v, z1]),
            u_range=[-2.5, 2.5],
            v_range=[-2.5, 2.5],
            resolution=(15, 15),
        ).set_opacity(0.2)
        plane2 = Surface(
            lambda u, v: np.array([u, v, z2]),
            u_range=[-2.5, 2.5],
            v_range=[-2.5, 2.5],
            resolution=(15, 15),
        ).set_opacity(0.2)

        self.add(plane1, plane2)

        # Highlight the area on the sphere between the two planes
        theta1 = np.arccos(z1 / radius)
        theta2 = np.arccos(z2 / radius)

        band = Surface(
            lambda u, v: sphere.get_center() + radius * np.array([
                np.sin(u) * np.cos(v),
                np.sin(u) * np.sin(v),
                np.cos(u)
            ]),
            u_range=[theta2, theta1],
            v_range=[0, TAU],
            resolution=(48, 48),
            fill_color=BLUE,
            fill_opacity=0.7
        )
        self.add(band)

        # Formula and annotations
        formula = MathTex(r"Area = 2\pi R \cdot d", font_size=48).to_corner(UL).shift(DOWN)
        self.add_fixed_in_frame_mobjects(formula)
        
        # Create separate parts for better control
        r_part = MathTex(r"2\pi R", font_size=48, color=RED).to_corner(UL).shift(DOWN + RIGHT * 2)
        d_part = MathTex(r"d", font_size=48, color=GREEN).next_to(r_part, RIGHT, buff=0.3)
        
        # Brace for "Circumference"
        brace_circumference = Brace(r_part, DOWN, buff=0.1)
        label_circumference = brace_circumference.get_text("Circumference")
        self.add_fixed_in_frame_mobjects(r_part, brace_circumference, label_circumference)
        
        # Box for "Thickness"
        box_thickness = SurroundingRectangle(d_part, buff=0.1)
        label_thickness = Text("Thickness").next_to(box_thickness, DOWN)
        self.add_fixed_in_frame_mobjects(d_part, box_thickness, label_thickness)

        self.wait(2)